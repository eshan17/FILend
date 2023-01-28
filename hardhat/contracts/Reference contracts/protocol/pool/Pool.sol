// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import {IPool} from "../../interfaces/IPool.sol";
import {MinerAPI} from "../../filecoinMockAPIs/MinerAPI.sol";
import {SupplyLogic} from '../libraries/logic/SupplyLogic.sol';
import {PoolStorage} from './PoolStorage.sol';
import {DataTypes} from '../libraries/types/DataTypes.sol';
import {Errors} from '../libraries/helpers/Errors.sol';


contract LoanAgent {
  uint256 _collateral;
  uint256 _income;
  address public immutable _onBehalf;
  uint40 lastUpdateTimestamp;
  bool public immutable isActivated;
  uint256 interestRate;
  constructor(address onBehalf, uint256 collateral ){
    _onBehalf = onBehalf;
    _collateral = collateral;
    lastUpdateTimestamp = uint40(block.timestamp);
    isActivated = false;
    interestRate = 2;
  }
  
  function calculateInterests() public returns (bool){
    require(isActivated==true);
    _income += interestRate*uint256(uint40(block.timestamp)-lastUpdateTimestamp);
    return true;
  }

  function repay(uint256 amount) public returns (bool){
    require(isActivated==true);
    calculateInterests();
    
    payable(MinerAPI(_onBehalf).get_beneficiary()).transfer(_income);

    if (_collateral> amount){
        _collateral-=amount;
    } else {
        _collateral = 0;
        MinerAPI(_onBehalf).change_beneficiary(_onBehalf);
        MinerAPI(_onBehalf).change_owner_address(_onBehalf);
    }
  }

  function activate() public returns (bool) {
    require(isActivated==false);
    isActivated = true;
    require( msg.sender == _onBehalf , "must be the onBehalf to activate the loan.");
    // LoanMarket contract will check owner address as LoanAgent
    require(MinerAPI(_onBehalf).get_owner() == address(this));
    // LoanMarket contract will change the beneficiary address of the miner actor to be the LoanAgent
    MinerAPI(_onBehalf).change_beneficiary(address(this));
    // LoanMarket contract will check beneficiary as LoanAgent
    require(MinerAPI(_onBehalf).get_beneficiary() == address(this));
    lastUpdateTimestamp = uint40(block.timestamp);
    return true;
  }

   // benficiary could be the lender
  function activate(address lender) public returns (bool) {

    require(isActivated==false);
    isActivated = true;

    require( msg.sender == _onBehalf , "must be the onBehalf to activate the loan.");
    // LoanMarket contract will check owner address as LoanAgent
    require(MinerAPI(_onBehalf).get_owner() == address(this));
    // LoanMarket contract will change the beneficiary address of the miner actor to be the lender
    MinerAPI(_onBehalf).change_beneficiary(lender);
    // LoanMarket contract will check beneficiary as LoanAgent
    require(MinerAPI(_onBehalf).get_beneficiary() == lender);
    lastUpdateTimestamp = uint40(block.timestamp);
    return true;
  }  
}

contract Pool is PoolStorage, IPool {
    address public immutable poolOwner;

    /**
     * @dev Constructor.
     */
    constructor(address provider) {
        poolOwner = provider;
    }

    /**
     * @notice Map from FILAddress to sFILAddress.
     * @param FILAddress FIL address
     * @param sFILAddress The address of the overlying sFILAddress contract
     **/
    function init(
        address FILAddress,
        address sFILAddress
    ) external {
        require(msg.sender == poolOwner);
        require(_reserves[FILAddress].sFILAddress == address(0), Errors.RESERVE_ALREADY_INITIALIZED);
        _reserves[FILAddress].sFILAddress = sFILAddress;
    }

    function supply(
        address asset,
        uint256 amount,
        address onBehalfOf
    ) public virtual override {
        SupplyLogic.executeSupply(
            _reserves,
            DataTypes.ExecuteSupplyParams({
                from: msg.sender,
                asset: asset,
                amount: amount,
                onBehalfOf: onBehalfOf

        );
    }

    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) public virtual override returns (uint256) {
        return
        SupplyLogic.executeWithdraw(
            _reserves,
            DataTypes.ExecuteWithdrawParams({
            asset: asset,
            amount: amount,
            to: to
            })
        );
    }

    // the function that Loan request is sent to LendingMarket contract
    function underwrite(
        address owner, 
        address asset,
        uint256 amount
    ) public virtual returns (address) {
        SupplyLogic.executeUnderwrite(
            _reserves,
            DataTypes.ExecuteUnderwriteParams({
            asset: asset,
            amount: amount,
            owner: owner
            })
        );

        /* swap amount to FIL if asset != FIL*/
        // LendingMarket create (CREATE2) a LoanAgent contract 
        LoanAgent loanAgent = new LoanAgent{salt: abi.encodePacked(uint40(block.timestamp))}(owner, amount);

        // switch miner actor's owner to LoanAgent contract address. 
        MinerAPI(owner).change_owner_address(address(loanAgent));
        return address(loanAgent);
    }

}

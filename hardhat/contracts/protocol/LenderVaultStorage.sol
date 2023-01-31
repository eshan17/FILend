// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

/**
 * @title LenderVaultStorage
 */
contract LenderVaultStorage {
    // address of loan manager
    address internal _loanManager;
    // minimum liquid asset
    uint256 internal _minLiquidAsset;
    // accumulative amount of asset deposited
    uint256 internal _totalDeposited;
    // accumulative amount of asset lent out
    uint256 internal _totalLentOut;
    // current amount of asset lent out = totalLentOut - _totalPrincipalReceived
    uint256 internal _currentLentOut;
    // accumulative amount of principal received
    uint256 internal _totalPrincipalReceived;
    // accumulative amount of interest received
    uint256 internal _totalInterestReceived;
    // accumulative amount of principal loss
    uint256 internal _totalPrincipalLoss;
    // default lock period of lender's deposit
    uint public lockPeriod;

    // Add the library methods
    using EnumerableSet for EnumerableSet.AddressSet;
    // address set of all lenders
    EnumerableSet.AddressSet internal _lenderSet;

    // mapping of lender's deposit lock-till datetime
    mapping(address => uint) internal _lenderDepositLockTillMap;

    /**
     * @dev return total number lenders
     */
    function numOfLenders() external view returns (uint256) {
        return _lenderSet.length();
    }

    /**
     * @dev return _totalDeposited
     */
    function totalDeposited() external view returns (uint256) {
        return _totalDeposited;
    }

    /**
     * @dev return _totalLentOut
     */
    function totalLentOut() external view returns (uint256) {
        return _totalLentOut;
    }

    /**
     * @dev return _currentLentOut
     */
    function currentLentOut() external view returns (uint256) {
        return _currentLentOut;
    }

    /**
     * @dev return _totalPrincipalReceived
     */
    function totalPrincipalReceived() external view returns (uint256) {
        return _totalPrincipalReceived;
    }

    /**
     * @dev return _totalInterestReceived
     */
    function totalInterestReceived() external view returns (uint256) {
        return _totalInterestReceived;
    }

    /**
     * @dev return _totalPrincipalLoss
     */
    function totalPrincipalLoss() external view returns (uint256) {
        return _totalPrincipalLoss;
    }

    /**
     * @dev return _totalPrincipalLoss
     */
    function depositLockTillOf(address lender) external view returns (uint) {
        require(lender != address(0), "lender cannot be zero");
        return _lenderDepositLockTillMap[lender];
    }
}
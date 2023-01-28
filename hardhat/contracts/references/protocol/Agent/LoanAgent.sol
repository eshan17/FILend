pragma solidity >=0.4.25 <=0.8.17;

contract LoanAgent {
  uint256 _collateral;
  uint256 _income;
  address _onBehalf;

  constructor(address onBehalf, uint256 collateral ){
    _onBehalf = onBehalf;
    _collateral = collateral;
  }
  
}
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

library DataTypes {

  enum InterestRateMode {
    NONE
  }

  struct ReserveData {
  //sFIL address
  address sFILAddress;
  //timestamp of last update
  uint40 lastUpdateTimestamp;
  }

  struct ExecuteSupplyParams {
    address from;
    address asset;
    uint256 amount;
    address onBehalfOf;
  }

  struct ExecuteWithdrawParams {
    address asset;
    uint256 amount;
    address to;
  }


  struct ExecuteUnderwriteParams {
    address asset;
    uint256 amount;
    address owner;
  }

}
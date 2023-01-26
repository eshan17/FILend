// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;

import {DataTypes} from '../protocol/libraries/types/DataTypes.sol';

/**
 * @title IPool
 * @notice Defines the basic interface for an FIL Lending Pool.
 **/
 interface IPool{


  event Supply(
    address indexed reserve,
    address user,
    address indexed onBehalfOf,
    uint256 amount
  );


  event Withdraw(address indexed reserve, address indexed user, address indexed to, uint256 amount);


  event Borrow(
    address indexed reserve,
    address user,
    address indexed onBehalfOf,
    uint256 amount,
    DataTypes.InterestRateMode interestRateMode,
    uint256 borrowRate
  );


  event Repay(
    address indexed reserve,
    address indexed user,
    address indexed repayer,
    uint256 amount,
    bool useATokens
  );


  function supply(
    address asset,
    uint256 amount,
    address onBehalfOf
  ) external;


  function withdraw(
    address asset,
    uint256 amount,
    address to
  ) external returns (uint256);


 }
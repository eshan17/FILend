// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

interface IWFIL {

  function transferFrom(address from, address to, uint256 amount) external returns(bool);
}
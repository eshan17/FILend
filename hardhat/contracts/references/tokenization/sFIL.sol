// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IsFIL} from '../interfaces/IsFIL.sol';

contract sFIL is IsFIL {
  
        mapping (address => uint256) balances;
        mapping (address => uint256) negativeBalances;
        address public immutable ADMIN;

        constructor(address poolAddress) {
            require(poolAddress != address(0), "");
            ADMIN = poolAddress;
        }

        function mint(address caller,
                             address onBehalfOf,
                             uint256 amount) external returns (bool) {
          require(ADMIN != address(0), "");                         
          require(msg.sender == ADMIN);
          balances[onBehalfOf]+=amount;
          return true;
        }

        function burn(address from, uint256 amount) external  {
            require(ADMIN != address(0), "");                         
            require(msg.sender == ADMIN);
            balances[from]-=amount;
        }

        function borrow(address receiver, uint256 amount) external  {
            require(ADMIN != address(0), "");                         
            require(msg.sender == ADMIN);
            negativeBalances[receiver]+=amount;
            balances[receiver]-=amount;
        }

        function balanceOf(address user) external view returns (uint256){
          return balances[user];
        }

}
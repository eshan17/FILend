// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IWFIL} from '../interfaces/IWFIL.sol';

contract WFIL is IWFIL {

    string public name = 'Wrapped FIL';
    string public symbol = 'WFIL';
    uint8 public decimals = 18;

    mapping (address => uint256) balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 wad) public {
      require(balances[msg.sender] >= wad);
      balances[msg.sender] -= wad;
      payable(msg.sender).transfer(wad);
    }

    function transferFrom(address from, address to, uint256 amount) public returns(bool) {
      require(balances[from] >= amount);
      balances[from] -= amount;
      balances[to] += amount;
      return true;
    }

    function balanceOf(address addr) public view returns(uint256) {
      return balances[addr];
    }

}
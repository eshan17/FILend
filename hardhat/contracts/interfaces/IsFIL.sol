// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

interface IsFIL {

    function mint(address caller, address onBehalfOf, uint256 amount) external returns (bool);

    function burn(address from, uint256 amount) external;

    function balanceOf(address user) external view returns (uint256);


}
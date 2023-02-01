// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("Test", "TEST") {}

    function faucet(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    function wrapAndApproveTo(address approveTo) external payable {
        require(msg.value > 0, "msg.value cannot be zero");
        _mint(_msgSender(), msg.value);
        approve(approveTo, msg.value);
    }

    function unwrap(uint256 amount) external {
        require(amount > 0, "amount cannot be zero");
        require(balanceOf(_msgSender()) >= amount, "insufficient balance");
        _burn(_msgSender(), amount);
        payable(_msgSender()).transfer(amount);
    }
}

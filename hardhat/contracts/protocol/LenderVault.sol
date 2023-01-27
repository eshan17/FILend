// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LenderVault is ERC4626, Ownable {
    address _loanManager;
    uint256 _minLiquidAsset;
    uint256 _totalLentOut;

    event LoanManagerUpdated(address loanManager);
    event LentOut(uint256 amount, address receiver);

    constructor(address asset_, string memory name_, string memory symbol_) ERC4626(IERC20(asset_)) ERC20(name_, symbol_) {

    }

    function setLoanManager(address loanManager_) external onlyOwner {
        require(loanManager_ != address(0), "loanManager_ cannot be zero");
        _loanManager = loanManager_;
        emit LoanManagerUpdated(loanManager_);
    }

    /**
     * @dev Throws if the sender is not the loanManager.
     */
    function _checkLoanManager() internal view virtual {
        require(_loanManager != address(0), "loanManager cannot be zero");
        require(_loanManager == _msgSender(), "onlyLoanManager");
    }

    /**
     * @dev Throws if called by any account other than the loanManager.
     */
    modifier onlyLoanManager() {
        _checkLoanManager();
        _;
    }

    function borrowFromVault(uint256 amount_, address receiver_) external onlyLoanManager {
        require(amount_ > 0, "amount_ cannot be zero");
        require(receiver_ != address(0), "receiver_ cannot be zero");
        require(amount_ <= totalAssets(), "out of assets");
        require(totalAssets() - amount_ >= _minLiquidAsset, "out of liquid assets");

        _totalLentOut += amount_;
        SafeERC20.safeTransfer(IERC20(asset()), receiver_, amount_);
        emit LentOut(amount_, receiver_);
    }

    function totalLentOut() external view returns (uint256) {
        return _totalLentOut;
    }
}
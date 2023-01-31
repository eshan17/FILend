// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import "./LenderVaultStorage.sol";

/**
 * @title LenderVault
 */
contract LenderVault is ERC4626, Ownable, LenderVaultStorage {
    // Add library methods
    using Math for uint256;
    using EnumerableSet for EnumerableSet.AddressSet;

    event LoanManagerUpdated(address loanManager);
    event LockPeriodUpdated(uint lockPeriod_);
    event LentOut(uint256 amount, address receiver);
    event Payback(uint256 principal, uint256 interest);
    event PrincipalLoss(uint256 loss);

    /**
     * @dev constructor
     * @param asset_ The address of the underlaying asset
     * @param name_ The name of the token representing the shares
     * @param symbol_ The symbol of the token representing the shares
     */
    constructor(address asset_, string memory name_, string memory symbol_) ERC4626(IERC20(asset_)) ERC20(name_, symbol_) {

    }

    //onlyOwner ===========================

    /**
     * @dev update the address of the loan manager contract
     * onlyOwner
     * emit LoanManagerUpdated
     */
    function updateLoanManager(address loanManager_) external onlyOwner {
        require(loanManager_ != address(0), "loanManager_ cannot be zero");
        _loanManager = loanManager_;
        emit LoanManagerUpdated(loanManager_);
    }

    /**
     * @dev set the address of the loan manager contract
     * onlyOwner
     * emit LoanManagerUpdated
     */
    function updateLockPeriod(uint lockPeriod_) external onlyOwner {
        require(lockPeriod_ > 0, "lockPeriod_ cannot be zero");
        lockPeriod = lockPeriod_;
        emit LockPeriodUpdated(lockPeriod);
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

    //IERC4626 ===========================

    /**
     * @dev Internal conversion function (from assets to shares) with support for rounding direction.
     * Will revert if assets > 0, totalSupply > 0 and totalAssets = 0. That corresponds to a case where any asset
     * would represent an infinite amount of shares.
     * replaced totalAssets() with totalVirtualAssets()
     */
    function _convertToShares(uint256 assets, Math.Rounding rounding) internal view virtual override returns (uint256) {
        uint256 supply = totalSupply();
        return
            (assets == 0 || supply == 0)
                ? _initialConvertToShares(assets, rounding)
                : assets.mulDiv(supply, totalVirtualAssets(), rounding);
    }

    /**
     * @dev Internal conversion function (from shares to assets) with support for rounding direction.
     * replaced totalAssets() with totalVirtualAssets()
     */
    function _convertToAssets(uint256 shares, Math.Rounding rounding) internal view virtual override returns (uint256) {
        uint256 supply = totalSupply();
        return
            (supply == 0) ? _initialConvertToAssets(shares, rounding) : shares.mulDiv(totalVirtualAssets(), supply, rounding);
    }

    /** 
     * @dev See {IERC4626-deposit}.
     * everytime a lender deposit, the lock-till datetime will be updated to now + lockPeriod
     */
    function deposit(uint256 assets, address receiver) public virtual override returns (uint256) {
        uint256 shares_ = super.deposit(assets, receiver);
        _totalDeposited += assets;
        _lenderDepositLockTillMap[receiver] = block.timestamp + lockPeriod;
        _lenderSet.add(receiver);
        return shares_;
    }

    /** @dev See {IERC4626-redeem}. */
    function redeem(uint256 shares, address receiver, address owner) public virtual override returns (uint256) {
        require(owner != address(0), "owner cannot be zero");
        require(_lenderDepositLockTillMap[owner] <= block.timestamp, "assets are locked");
        return super.redeem(shares, receiver, owner);
    }

    /** @dev See {IERC4626-withdraw}. */
    function withdraw(uint256 assets, address receiver, address owner) public virtual override returns (uint256) {
        require(owner != address(0), "owner cannot be zero");
        require(_lenderDepositLockTillMap[owner] <= block.timestamp, "assets are locked");
        return super.withdraw(assets, receiver, owner);
    }

    //lender vault ===========================

    /**
     * @dev return totalAssets + _currentLentOut
     */
    function totalVirtualAssets() public view virtual returns (uint256) {
        return IERC20(asset()).balanceOf(address(this)) + _currentLentOut;
    }

    /**
     * @dev return assets converted by account's shares balance, which represents principal + interests
     */
    function virtualBalanceOf(address account) public view virtual returns (uint256) {
        return _convertToAssets(balanceOf(account), Math.Rounding.Down);
    }

    /**
     * @dev borrow assets from the vault
     * @param assets_ The amount of asset to borrow
     * @param receiver_ The address of the receiver
     * onlyLoanManager
     * emit LentOut
     */
    function borrowFromVault(uint256 assets_, address receiver_) external onlyLoanManager {
        require(assets_ > 0, "assets_ cannot be zero");
        require(receiver_ != address(0), "receiver_ cannot be zero");
        require(assets_ <= totalAssets(), "out of assets");
        require(totalAssets() - assets_ >= _minLiquidAsset, "out of liquid assets");

        _totalLentOut += assets_;
        _currentLentOut += assets_;
        SafeERC20.safeTransfer(IERC20(asset()), receiver_, assets_);
        emit LentOut(assets_, receiver_);
    }

    /**
     * @dev pay back to vault, the loan details are being managed by the loan manager, the vault does not know anything about the loan
     * @param principal_ The amount of principal to pay back
     * @param interest_ The amount of interest to pay back
     * onlyLoanManager
     * emit Payback
     */
    function payBackToVault(uint256 principal_, uint256 interest_) external onlyLoanManager {
        require(principal_ + interest_ > 0, "payback cannot be zero");

        SafeERC20.safeTransferFrom(IERC20(asset()), _loanManager, address(this), (principal_ + interest_));

        if (principal_ > _currentLentOut) {
            _currentLentOut = 0;
        } else {
            _currentLentOut -= principal_;
        }
        _totalPrincipalReceived += principal_;
        _totalInterestReceived += interest_;
        
        emit Payback(principal_, interest_);
    }

    /**
     * @dev In case of loan default, the loan manager will call this function to realize the loss
     * @param loss_ The amount of principal loss
     * onlyLoanManager
     * emit PrincipalLoss
     */
    function realizePrincipalLoss(uint256 loss_) external onlyLoanManager {
        require(loss_ > 0, "loss_ cannot be zero");
        require(loss_ <= _currentLentOut, "loss_ cannot be greater than _currentLentOut");

        _currentLentOut -= loss_;
        _totalPrincipalLoss += loss_;

        emit PrincipalLoss(loss_);
    }
}
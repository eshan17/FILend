// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import "./LenderVaultStorage.sol";

/**
 * @title LenderVault
 */
contract LenderVault is ERC4626, Ownable, LenderVaultStorage {
    // Add the library methods
    using EnumerableSet for EnumerableSet.AddressSet;
    
    event LoanManagerUpdated(address loanManager);
    event DefaultLockPeriodUpdated(uint lockPeriod);
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

    /** @dev See {IERC4626-deposit}. */
    function deposit(uint256 assets, address receiver) public virtual override returns (uint256) {
        uint256 shares_ = super.deposit(assets, receiver);
        _totalDeposited += assets;
        _lenderSet.add(_msgSender());
        return shares_;
    }

    /**
     * @dev set the address of the loan manager contract
     * onlyOwner
     * emit LoanManagerUpdated
     */
    function setLoanManager(address loanManager_) external onlyOwner {
        require(loanManager_ != address(0), "loanManager_ cannot be zero");
        _loanManager = loanManager_;
        emit LoanManagerUpdated(loanManager_);
    }

    /**
     * @dev set the address of the loan manager contract
     * onlyOwner
     * emit LoanManagerUpdated
     */
    function setDefaultLockPeriod(uint lockPeriod_) external onlyOwner {
        _defaultLockPeriod = lockPeriod_;
        emit DefaultLockPeriodUpdated(lockPeriod_);
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

    /**
     * @dev borrow assets from the vault
     * @param amount_ The amount of asset to borrow
     * @param receiver_ The address of the receiver
     * onlyLoanManager
     * emit LentOut
     */
    function borrowFromVault(uint256 amount_, address receiver_) external onlyLoanManager {
        require(amount_ > 0, "amount_ cannot be zero");
        require(receiver_ != address(0), "receiver_ cannot be zero");
        require(amount_ <= totalAssets(), "out of assets");
        require(totalAssets() - amount_ >= _minLiquidAsset, "out of liquid assets");

        _totalLentOut += amount_;
        _currentLentOut += amount_;
        SafeERC20.safeTransfer(IERC20(asset()), receiver_, amount_);
        emit LentOut(amount_, receiver_);
    }

    /**
     * @dev distribute the interest received in payback to all lenders in the vault according to the ratio of their shares
     * @param interest_ The amount of interest to distribute
     * internal function to be called by payBackToVault
     */
    function _distributeInterestShares(uint256 interest_) internal {
        require(interest_ > 0, "interest_ cannot be zero");
        uint256 totalShares_ = totalSupply();
        require(totalShares_ > 0, "totalShares cannot be zero");

        address[] memory lenders = _lenderSet.values();
        for (uint256 i = 0; i < lenders.length; i++) {
            address lender_ = lenders[i];
            uint256 share_ = balanceOf(lender_);
            if (share_ > 0) {
                uint256 interestShare_ = interest_ * share_ / totalShares_;
                _mint(lender_, interestShare_);
            }
        }
    }

    /**
     * @dev subtract loss shares from all lenders in the vault according to the ratio of their shares 
     * @param loss_ The amount of loss to subtract
     * internal function to be called by realizePrincipalLoss
     */
    function _subtractLossShares(uint256 loss_) internal {
        require(loss_ > 0, "loss_ cannot be zero");
        uint256 totalShares_ = totalSupply();
        require(totalShares_ > 0, "totalShares cannot be zero");
        require(loss_ <= totalShares_, "loss_ cannot be greater than totalShares_");

        address[] memory lenders = _lenderSet.values();
        for (uint256 i = 0; i < lenders.length; i++) {
            address lender_ = lenders[i];
            uint256 share_ = balanceOf(lender_);
            if (share_ > 0) {
                uint256 lossShare_ = loss_ * share_ / totalShares_;
                _burn(lender_, lossShare_);
            }
        }
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

        if (interest_ > 0) {
            SafeERC20.safeTransferFrom(IERC20(asset()), _loanManager, address(this), interest_);
            _distributeInterestShares(interest_);
            _totalInterestReceived += interest_;
        }

        if (principal_ > 0) {
            SafeERC20.safeTransferFrom(IERC20(asset()), _loanManager, address(this), principal_);
            if (principal_ > _currentLentOut) {
                _currentLentOut = 0;
            } else {
                _currentLentOut -= principal_;
            }
            _totalPrincipalReceived += principal_;
        }
        
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

        _subtractLossShares(loss_);
        _currentLentOut -= loss_;
        _totalPrincipalLoss += loss_;
        emit PrincipalLoss(loss_);
    }
}
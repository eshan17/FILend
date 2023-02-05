// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import "./LoanManagerStorage.sol";
import "./LenderVault.sol";

/**
 * @title LoanManager
 */
contract LoanManager is Ownable, LoanManagerStorage {
    // Add library methods
    using Math for uint256;
    using EnumerableSet for EnumerableSet.UintSet;

    event LenderVaultJuniorUpdated(address lenderVault);
    event LenderVaultSeniorUpdated(address lenderVault);

    /**
     * @dev constructor
     */
    constructor() {

    }

    //onlyOwner ===========================

    /**
     * @dev update the address of the lender vault junior contract
     * onlyOwner
     * emit LenderVaultJuniorUpdated
     */
    function updateLenderVaultJunior(address lenderVault_) external onlyOwner {
        require(lenderVault_ != address(0), "lenderVault_ cannot be zero");
        _lenderVaultJunior = lenderVault_;
        emit LenderVaultJuniorUpdated(lenderVault_);
    }

    /**
     * @dev update the address of the lender vault senior contract
     * onlyOwner
     * emit LenderVaultSeniorUpdated
     */
    function updateLenderVaultSenior(address lenderVault_) external onlyOwner {
        require(lenderVault_ != address(0), "lenderVault_ cannot be zero");
        _lenderVaultSenior = lenderVault_;
        emit LenderVaultSeniorUpdated(lenderVault_);
    }

    //external ===========================

    function addLoanRecord(address borrower_, uint256 amount_, uint loanDuration_, uint256 totalReturn_, uint256 interestRate_, uint repaymentDate_, uint lendingDate_) external {
        require(_msgSender() != address(0), "sender cannot be zero");
        uint256 currentLoanId = nextLoanId;
        nextLoanId++;
        loanRecords.push(LoanRecord(borrower_, amount_, loanDuration_, totalReturn_, interestRate_, repaymentDate_, lendingDate_, currentLoanId));
        _borrowerLoanRecordIdSetMap[borrower_].add(currentLoanId);
    }

    function getLoanRecordIdsOf(address borrower_) external view returns (uint256[] memory) {
        require(borrower_ != address(0), "borrower_ cannot be zero");
        return _borrowerLoanRecordIdSetMap[borrower_].values();
    }

    function getLoanRecordOf(uint256 loanRecordId_) external view returns (LoanRecord memory) {
        require(loanRecordId_ > 0 && loanRecordId_ < nextLoanId, "invalid loanRecordId_");
        return loanRecords[loanRecordId_ - 1];
    }

    function takeOutLoanTokenFor(uint256 loanRecordId_) external {
        require(loanRecordId_ > 0 && loanRecordId_ < nextLoanId, "invalid loanRecordId_");
        require(_lenderVaultJunior != address(0), "lenderVaultJunior cannot be zero");
        require(_lenderVaultSenior != address(0), "lenderVaultSenior cannot be zero");
        LoanRecord memory loanRecord = loanRecords[loanRecordId_ - 1];
        require(loanRecord.borrower == _msgSender(), "only borrower can borrow");
        require(loanRecord.amount > 0, "loanRecord.amount cannot be zero");
        require(_loanRecordIdToJuniorShareMap[loanRecordId_] == 0, "already borrowed");
        require(_loanRecordIdToSeniorShareMap[loanRecordId_] == 0, "already borrowed");

        uint256 juniorBalance_ = ERC20(LenderVault(_lenderVaultJunior).asset()).balanceOf(_lenderVaultJunior);
        uint256 seniorBalance_ = ERC20(LenderVault(_lenderVaultSenior).asset()).balanceOf(_lenderVaultSenior);
        uint256 totalBalance_ = juniorBalance_ + seniorBalance_;
        require(totalBalance_ >= loanRecord.amount, "not enough funds");

        uint256 juniorAmount_ = Math.mulDiv(juniorBalance_, loanRecord.amount, totalBalance_);
        uint256 seniorAmount_ = Math.mulDiv(seniorBalance_, loanRecord.amount, totalBalance_);

        //Junior share is 3 times the senior share
        _loanRecordIdToJuniorShareMap[loanRecordId_] = Math.mulDiv(juniorAmount_, 3, 1);
        LenderVault(_lenderVaultJunior).borrowFromVault(juniorAmount_, _msgSender());
        _loanRecordIdToSeniorShareMap[loanRecordId_] = seniorAmount_;
        LenderVault(_lenderVaultSenior).borrowFromVault(seniorAmount_, _msgSender());
    }

    function payBackFor(uint256 loanRecordId_, uint256 amount_) external {
        require(loanRecordId_ > 0 && loanRecordId_ < nextLoanId, "invalid loanRecordId_");
        require(_lenderVaultJunior != address(0), "lenderVaultJunior cannot be zero");
        require(_lenderVaultSenior != address(0), "lenderVaultSenior cannot be zero");
        LoanRecord memory loanRecord = loanRecords[loanRecordId_ - 1];
        require(loanRecord.borrower == _msgSender(), "only borrower can pay back");
        require(amount_ > 0, "amount_ cannot be zero");

        SafeERC20.safeTransferFrom(IERC20(LenderVault(_lenderVaultJunior).asset()), _msgSender(), address(this), amount_);

        uint256 juniorShare_ = _loanRecordIdToJuniorShareMap[loanRecordId_];
        uint256 seniorShare_ = _loanRecordIdToSeniorShareMap[loanRecordId_];
        uint256 totalShare_ = juniorShare_ + seniorShare_;
        uint256 juniorAmount_ = Math.mulDiv(amount_, juniorShare_, totalShare_);
        uint256 seniorAmount_ = amount_ - juniorAmount_;

        //for hackathon purpose, simply take 50% for principal, 50% for interest
        uint256 juniorPrincipalAmount_ = Math.mulDiv(juniorAmount_, 50, 100);
        uint256 juniorInterestAmount_ = juniorAmount_ - juniorPrincipalAmount_;
        uint256 seniorPrincipalAmount_ = Math.mulDiv(seniorAmount_, 50, 100);
        uint256 seniorInterestAmount_ = seniorAmount_ - seniorPrincipalAmount_;

        ERC20(LenderVault(_lenderVaultSenior).asset()).approve(_lenderVaultSenior, seniorAmount_);
        LenderVault(_lenderVaultSenior).payBackToVault(seniorPrincipalAmount_, seniorInterestAmount_);
        ERC20(LenderVault(_lenderVaultJunior).asset()).approve(_lenderVaultJunior, juniorAmount_);
        LenderVault(_lenderVaultJunior).payBackToVault(juniorPrincipalAmount_, juniorInterestAmount_);

        loanRecords[loanRecordId_ - 1].totalReturn += amount_;
    }
}
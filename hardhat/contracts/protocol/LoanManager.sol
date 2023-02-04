// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import "./LoanManagerStorage.sol";

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

    //public ===========================

    function addLoanRecord(address borrower_, uint256 amount_, uint loanDuration_, uint256 totalReturn_, uint256 interestRate_, uint repaymentDate_, uint lendingDate_) external {
        require(_msgSender() != address(0), "sender cannot be zero");
        loanRecords.push(LoanRecord(borrower_, amount_, loanDuration_, totalReturn_, interestRate_, repaymentDate_, lendingDate_));
        borrowerLoanRecordIdSetMap[borrower_].add(nextLoadId);
        nextLoadId++;
    }

    function getLoanRecordIdsOf(address borrower_) external view returns (uint256[] memory) {
        require(borrower_ != address(0), "borrower_ cannot be zero");
        return borrowerLoanRecordIdSetMap[borrower_].values();
    }

    function getLoanRecordOf(uint256 loanRecordId_) external view returns (LoanRecord memory) {
        require(loanRecordId_ > 0, "loanRecordId_ cannot be zero");
        return loanRecords[loanRecordId_ - 1];
    }
}
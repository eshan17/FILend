// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

/**
 * @title LoanManagerStorage
 */
contract LoanManagerStorage {
    // Add the library methods
    using EnumerableSet for EnumerableSet.UintSet;

    // vault addresses
    address internal _lenderVaultJunior;
    address internal _lenderVaultSenior;

    struct LoanRecord {
        address borrower;
        uint256 amount;
        uint loanDuration;
        uint256 totalReturn;
        uint256 interestRate;
        uint repaymentDate;
        uint lendingDate;
        uint256 loanId;
    }

    uint256 public nextLoanId = 1;
    LoanRecord[] public loanRecords;
    mapping(address => EnumerableSet.UintSet) internal _borrowerLoanRecordIdSetMap;

    mapping(uint256 => uint256) internal _loanRecordIdToJuniorShareMap;
    mapping(uint256 => uint256) internal _loanRecordIdToSeniorShareMap;
}
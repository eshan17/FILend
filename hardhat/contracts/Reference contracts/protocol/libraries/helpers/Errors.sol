// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.10;

/**
 * @title Errors library
 */
library Errors {
  string public constant INVALID_AMOUNT = '1'; // 'Amount must be greater than 0'
  string public constant NOT_ENOUGH_AVAILABLE_USER_BALANCE = '2'; // 'User cannot withdraw more than the available balance'
  string public constant RESERVE_ALREADY_INITIALIZED = '3'; // 'Reserve has already been initialized'
}

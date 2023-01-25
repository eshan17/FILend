// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import {Errors} from '../helpers/Errors.sol';
import {DataTypes} from '../types/DataTypes.sol';


/**
 * @title ReserveLogic library
 * @notice Implements functions to validate the different actions of the protocol
 */
library ValidationLogic {
  /**
   * @notice Validates a supply action.
   * @param amount The amount to be supplied
   */
  function validateSupply(uint256 amount)
    internal
    pure 
  {
    require(amount != 0, Errors.INVALID_AMOUNT);
  }

  /**
   * @notice Validates a withdraw action.
   * @param amount The amount to be withdrawn
   * @param userBalance The balance of the user
   */
  function validateWithdraw(
    uint256 amount,
    uint256 userBalance
  ) internal pure {
    require(amount != 0, Errors.INVALID_AMOUNT);
    require(amount <= userBalance, Errors.NOT_ENOUGH_AVAILABLE_USER_BALANCE);
  }

  /**
   * @notice Validates an underwrite action.
   * @param asset The asset address
   * @param owner The owner address
   * @param amount The amount to be loaned/underwritten
   */
  function validateWithdraw(
    address asset,
    address owner,
    uint256 amount
  ) internal pure {
    require(amount != 0, Errors.INVALID_AMOUNT);
    require(asset != address(0), Errors.INVALID_AMOUNT);
    require(owner != address(0), Errors.INVALID_AMOUNT);

  }

}

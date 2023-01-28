// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import {Errors} from '../helpers/Errors.sol';
import {DataTypes} from '../types/DataTypes.sol';

/**
 * @title ReserveLogic library
 * @notice Implements the logic to update the reserves state
 */
library ReserveLogic {
  using ReserveLogic for DataTypes.ReserveData;

  /**
   * @notice Updates the liquidity cumulative index and the variable borrow index.
   * @param reserve The reserve object
   **/
  function updateState(
    DataTypes.ReserveData storage reserve
  ) internal {
    _updateIndexes(reserve);
  }


  /**
   * @notice Updates the reserve indexes and the timestamp of the update.
   * @param reserve The reserve reserve to be updated
   **/
  function _updateIndexes(
    DataTypes.ReserveData storage reserve
  ) internal {
    reserve.lastUpdateTimestamp = uint40(block.timestamp);

  }

}

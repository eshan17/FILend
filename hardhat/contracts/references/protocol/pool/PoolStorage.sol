// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import {ReserveLogic} from '../libraries/logic/ReserveLogic.sol';
import {DataTypes} from '../libraries/types/DataTypes.sol';


contract PoolStorage {
  using ReserveLogic for DataTypes.ReserveData;
  mapping(address => DataTypes.ReserveData) internal _reserves;

}

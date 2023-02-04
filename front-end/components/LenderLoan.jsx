/** @format */

import React from "react";

const LenderLoan = ({
  SerialNo,
  PoolType,
  LendAmount,
  TotalReturn,
  InterestRate,
  LendingDate,
  EndingDate,
  Status,
  active,
  Tx,
}) => {
  return (
    <>
      <div className="grid-cols-9 mt-8   px-4 grid text-black font-medium text-lg ">
        <div>{SerialNo}</div>
        <div>{PoolType}</div>
        <div>{LendAmount}</div>
        <div>{TotalReturn}</div>
        <div>{InterestRate}</div>
        <div>{LendingDate}</div>
        <div>{EndingDate}</div>
        <div>
          {active ? (
            <button className="text-md font-semibold  bg-puprle px-8 py-2 text-white rounded-lg transition ease-in duration-150 text-sm hover:scale-110">
              {Status}
            </button>
          ) : (
            <button className="text-md font-semibold  bg-fil-secondary px-6 py-2 text-white rounded-lg transition ease-in duration-150 text-sm hover:scale-110">
              {Status}
            </button>
          )}
        </div>
        <div>
          {" "}
          <button
            onClick={Tx}
            className="text-md font-semibold  bg-fil-brown px-8 py-2 text-white rounded-lg transition ease-in duration-150 text-sm hover:scale-110"
          >
            Details
          </button>
        </div>
      </div>
    </>
  );
};

export default LenderLoan;

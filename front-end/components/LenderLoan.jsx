/** @format */

import React from "react";
import Link from "next/link";

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
  console.log("Transaction Hash " + Tx);
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
            <button className="text-md font-semibold  bg-puprle px-8 py-2 text-white rounded-lg transition ease-in duration-150 text-sm  ">
              {Status}
            </button>
          ) : (
            <button className="text-md font-semibold  bg-fil-secondary px-6 py-2 text-white rounded-lg transition ease-in duration-150 text-sm ">
              {Status}
            </button>
          )}
        </div>
        <div>
          <div className="transition ease-in duration-150  hover:scale-110">
            <Link
              className="text-md font-semibold  bg-fil-brown px-8 py-3 text-white rounded-lg transition ease-in duration-150 text-sm hover:scale-110"
              // href={`https://hyperspace.filfox.info/en/tx/${Tx}`}
              href={`https://hyperspace.filfox.info/en/tx/${Tx}`}
              target="_blank"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LenderLoan;

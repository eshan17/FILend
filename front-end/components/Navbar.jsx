/** @format */

import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Link from "next/link";

import { useEffect, useState } from "react";

const Navbar = ({ button, curretLink }) => {
  const { address, isConnecting, isDisconnected, isConnected, isReconnecting } =
    useAccount();

  return (
    <>
      <nav className="flex first-letter: items-center justify-around p-5 container mx-auto font-family-work-sans  ">
        <h2 className="   text-4xl text-center ml-3 font-bold text-fil-primary">
          FilLend
        </h2>

        <div className="   flex  w-auto  font-medium mt-2 ">
          <ul className=" space-x-6 font-family-work-sans items-center justify-between flex ">
            <Link
              className=" border-fil-primary inline-block hover:scale-110  transition ease-in duration-150 text-sm hover:text-fil-primary  px-2 py-2"
              href="/"
            >
              Home
              {curretLink === 0 && (
                <hr className="h-1 rounded-lg w-10 bg-fil-primary  " />
              )}
            </Link>

            <Link
              className=" inline-block hover:scale-110  transition ease-in duration-150 text-sm hover:text-fil-primary  px-2 py-2"
              href="/Lender"
            >
              Lender
              {curretLink === 1 && (
                <hr className="h-1 rounded-lg w-12 bg-fil-primary  " />
              )}
            </Link>
            <Link
              className=" inline-block hover:scale-110  transition ease-in duration-150 text-sm hover:text-fil-primary  px-2 py-2"
              href="/Borrower"
            >
              Borrower
              {curretLink === 2 && (
                <hr className="h-1 rounded-lg w-16 bg-fil-primary  " />
              )}
            </Link>
          </ul>
        </div>

        {button ? (
          <a href="#" className=" flex   px-2 py-2">
            <ConnectButton />
          </a>
        ) : (
          <a href="#" className="  flex   px-2 py-2   opacity-0 ">
            <ConnectButton />
          </a>
        )}
      </nav>
    </>
  );
};

export default Navbar;

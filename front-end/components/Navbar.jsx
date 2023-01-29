/** @format */

import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import Link from "next/link";

const Navbar = ({ button }) => {
  return (
    <>
      <nav class="flex flex-wrap items-center justify-between p-5 mx-8 font-family-work-sans  ">
        <h2 className=" text-4xl text-center ml-3 font-bold text-fil-primary">
          FilLend
        </h2>

        <div class="  w-auto flex text-right  font-medium mt-2 ">
          <ul className=" space-x-6 font-family-work-sans items-center justify-between ">
            <Link
              class=" inline-block hover:scale-110  transition ease-in duration-150 text-sm hover:text-fil-primary  px-2 py-2"
              href="/"
            >
              Home
            </Link>

            <Link
              class=" inline-block hover:scale-110  transition ease-in duration-150 text-sm hover:text-fil-primary  px-2 py-2"
              href="/Lender"
            >
              Lender
            </Link>
            <Link
              class=" inline-block hover:scale-110  transition ease-in duration-150 text-sm hover:text-fil-primary  px-2 py-2"
              href="/Borrower"
            >
              Borrower
            </Link>
          </ul>
        </div>

        {button ? (
          <a href="#" class=" inline-block   px-2 py-2">
            <ConnectButton />
          </a>
        ) : (
           
            <a href="#" class=" inline-block px-2 py-2  opacity-0 ">
            <ConnectButton />
            </a>
           
        )}
      </nav>
    </>
  );
};

export default Navbar;

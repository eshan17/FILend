/** @format */

import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar = () => {
  return (
    <>
      <nav class="flex flex-wrap items-center justify-between p-5 mx-8 font-family-work-sans  ">
        <h2 className=" text-4xl text-center ml-3 font-bold text-fil-primary">
          FilLend
        </h2>

        <div class="  w-auto flex text-right  font-medium mt-2 ">
          <ul
            className=" space-x-6 font-family-work-sans items-center justify-between   
             
           "
          >
            <a
              href="#"
              class=" inline-block hover:scale-110  transition ease-in duration-150 text-sm hover:text-fil-primary  px-2 py-2"
            >
              HOME
            </a>
            <a
              href="#"
              class=" inline-block hover:scale-110 transition ease-in duration-150 text-sm hover:text-fil-primary   px-2 py-2"
            >
              LENDER
            </a>
            <a
              href="#"
              class=" inline-block hover:scale-110 transition ease-in duration-150 text-sm hover:text-fil-primary  px-2 py-2"
            >
              BORROWER
            </a>
          </ul>
        </div>
        <a href="#" class=" inline-block   px-2 py-2">
          <ConnectButton />
        </a>
      </nav>
    </>
  );
};

export default Navbar;

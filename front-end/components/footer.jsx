/** @format */

import React from "react";

const footer = () => {
  return (
    <>
      <footer class="flex flex-wrap items-center justify-between p-5   font-family-work-sans bg-fil-primary">
        <h2 className=" text-4xl text-center ml-3 font-bold text-white">
          FilLend
        </h2>
        <div class="  w-auto flex text-right  font-medium mt-2 ">
          <ul
            className=" space-x-6 font-family-work-sans items-center justify-between text-white  
             
           "
          >
            <a
              href="#"
              class=" inline-block   transition ease-in duration-150 text-sm hover:hover:scale-110  px-2 py-2"
            >
              Home
            </a>
            <a
              href="#"
              class=" inline-block transition ease-in duration-150 text-sm hover:scale-110  px-2 py-2"
            >
              Become a Lender
            </a>
            <a
              href="#"
              class=" inline-block  transition ease-in duration-150 text-sm hover:scale-110 px-2 py-2"
            >
              Apply for Loan
            </a>

            <a
              href="#"
              class=" inline-block  transition ease-in duration-150 text-sm hover:scale-110 px-2 py-2"
            >
              Join Community
            </a>
          </ul>
        </div>
        <a href="#" class=" inline-block  text-white px-2 py-2">
          © CopyWrite 2023
        </a>
      </footer>
    </>
  );
};

export default footer;

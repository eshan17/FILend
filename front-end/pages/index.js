/** @format */

import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Navbar from "../components/Navbar.jsx";
import { Button } from "@/components/Button.js";

import img1 from "../public/Images/img.svg";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Home section */}
      <div className="flex  mt-8    py-2  ">
        {/* Left side */}
        <div className="flex flex-col items-start mx-12   space-y-6  w-7/12">
          <div>
            <h1 className="text-6xl font-bold max-w-3xl   ">
              Undercollaterized <a className="text-fil-primary">Loan</a> for
              Storage providers
            </h1>
          </div>

          <div>
            <p className="text-xl font-normal leading-9 text-gray-500 w-10/12">
              FilLend is an undercollaterized loan protocol. Which provides loan
              to the storage providers on the filecoin network to put up
              collateral and make as much storage deals as possible
            </p>
          </div>

          <div className="items-left justify-start">
            <Button {...{ text: "Get Started" }} />
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-col items-center p-4   justify-center w-6/12  ">
          <Image className=" -mt-24 ml-24 " src={img1}></Image>
        </div>
      </div>
    </>
  );
}

/** @format */

import React from "react";
import Fade from "react-reveal/Fade";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

import Loading from "@/components/Loading";

const address = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const { address, isConnecting, isDisconnected, isConnected, isReconnecting } =
    useAccount();
  useEffect(() => {
    setTimeout(() => {
      setData({ message: "Data loaded" });
      setLoading(false);
    }, 2000);

    if (isDisconnected) {
      router.push(`/Borrower`);
    }
  }, [isConnecting, isConnected]);

  return (
    <>
      <Fade top>
        <Navbar button={true} />
      </Fade>

      <div>
        {loading ? (
          <Loading />
        ) : (
          <>
            <Fade bottom>
              <div className=" bg-fil-secondary border-white text-white flex flex-col justify-center items-center container mx-auto py-20">
                <div className=" relative items-center justify-center space-y-2">
                  <h1 className="text-white text-3xl font-medium">
                    Borrow Loan
                  </h1>
                </div>

                <div className=" items-center w-4/12   justify-center">
                  <p className="text-white     border-white   justify-center items-center  mt-6">
                    A pool which returns higher interest rate but with a greater
                    chance of loss if the loan becomes default
                  </p>

                  <div className="mt-5   flex justify-center items-center ">
                    <button className="text-md font-semibold  px-8 py-2  justify-center items-center flex  transition ease-in duration-150 text-sm  text-white bg-fil-secondary border-2 border-white  hover:bg-white  hover:text-fil-secondary ">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </Fade>
          </>
        )}
      </div>
    </>
  );
};

export default address;

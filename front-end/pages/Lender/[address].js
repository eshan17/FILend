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
  const { address, isConnecting, isDisconnected, isConnected, isReconnecting } =
    useAccount();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setData({ message: "Data loaded" });
      setLoading(false);
    }, 2000);

    if (isDisconnected) {
      router.push(`/Lender`);
    }
  }, [isConnecting, isConnected]);

  return (
    <>
      <Fade top>
        <Navbar button={true} />
      </Fade>

      {loading ? (
        <Loading />
      ) : (
        <>
          <Fade bottom>
            <div className=" bg-fil-secondary border-white text-white flex flex-col justify-center items-center container mx-auto py-20">
              <div className=" relative items-center justify-center space-y-2">
                <h1 className="text-white text-3xl font-medium">Junior Pool</h1>
              </div>

              <div className="absolute top-142 left-100 ">
                <button className="text-md font-semibold   bg-white px-4 py-2 border-2 text-fil-secondary   transition ease-in duration-150 text-sm  hover:text-white hover:bg-fil-secondary hover:border-2 hover:border-white   ">
                  Junior Pool
                </button>
              </div>

              <div className="absolute top-142 left-235 ">
                <button className="text-md font-semibold  px-4 py-2    transition ease-in duration-150 text-sm  text-white bg-fil-secondary border-2 border-white  hover:bg-white  hover:text-fil-secondary ">
                  Senior Pool
                  {/* bg-white  text-fil-secondary */}
                </button>
              </div>

              <div className=" items-center w-4/12   justify-center">
                <p className="text-white    border-white   justify-center items-center  mt-6">
                  A pool which returns higher interest rate but with a greater
                  chance of loss if the loan becomes default
                </p>

                <div className="flex mt-12 items-center justify-center space-x-8">
                  <div className="flex-col space-y-2">
                    <h2>Interest Rate</h2>
                    <h2 className="border-2 px-8 text-center ">30</h2>
                  </div>

                  <div className="flex-col space-y-2">
                    <h2>Total Return</h2>
                    <h2 className="border-2 px-8 text-center ">0 FIL</h2>
                  </div>

                  <div className="flex-col space-y-2">
                    <h2>Repayment Date</h2>
                    <h2 className="border-2 px-8 text-center ">--/--/--</h2>
                  </div>
                </div>
              </div>
            </div>
          </Fade>
        </>
      )}
    </>
  );
};

export default address;

// const router = useRouter();
// const { address, isConnecting, isDisconnected } = useAccount();

// useEffect(() => {
//   if (isConnected) {
//     router.push(`/Lender/${address}`);
//   }
// }, [isConnecting, isConnected]);

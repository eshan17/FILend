/** @format */

import React from "react";
import Fade from "react-reveal/Fade";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import waves from "@/public/Images/waves.svg";
import Image from "next/image";
import LenderLoan from "@/components/LenderLoan";

const address = () => {
  const router = useRouter();
  const { address, isConnecting, isDisconnected, isConnected, isReconnecting } =
    useAccount();
  const [loading, setLoading] = useState(true);
  const [juniorPool, setJuniorPool] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setData({ message: "Data loaded" });
      setLoading(false);
    }, 100);

    if (isDisconnected) {
      router.push(`/Lender`);
    }
  }, [isConnecting, isConnected]);

  return (
    <>
      <Fade top>
        <Navbar button={true} curretLink={1} />
      </Fade>

      {loading ? (
        <Loading />
      ) : (
        <>
          <Fade bottom>
            {juniorPool ? (
              <>
                <Fade>
                  <div className=" bg-fil-secondary w-screen border-white text-white flex flex-col justify-center items-center container mx-auto py-20">
                    <div className=" relative items-center justify-center space-y-2">
                      <h1 className="text-white text-3xl font-medium">
                        Junior Pool
                      </h1>
                    </div>

                    <div
                      className="absolute top-16 left-24 "
                      onClick={() => {
                        setJuniorPool(true);
                      }}
                    >
                      <button className="text-md font-semibold   bg-white px-4 py-2 border-2 text-fil-secondary   transition ease-in duration-150 text-sm  hover:scale-110   ">
                        Junior Pool
                      </button>
                    </div>

                    <div
                      className="absolute top-16 left-56 "
                      onClick={() => {
                        setJuniorPool(false);
                      }}
                    >
                      <button className="text-md font-semibold  px-4 py-2    transition ease-in duration-150 text-sm  text-white bg-fil-secondary border-2 border-white  hover:scale-110  ">
                        Senior Pool
                      </button>
                    </div>

                    <div className=" items-center w-4/12   justify-center">
                      <p className="text-white    border-white   justify-center items-center  mt-6">
                        A pool which returns higher interest rate but with a
                        greater chance of loss if the loan becomes default
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
                          <h2 className="border-2 px-8 text-center ">
                            --/--/--
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div className="h-20"></div>
                  </div>
                </Fade>
              </>
            ) : (
              <>
                <Fade>
                  <div className=" bg-fil-secondary w-screen border-white text-white flex flex-col justify-center items-center container mx-auto py-20">
                    <div className=" relative items-center justify-center space-y-2">
                      <h1 className="text-white text-3xl font-medium">
                        Senior Pool
                      </h1>
                    </div>

                    <div
                      className="absolute top-16 left-24 "
                      onClick={() => {
                        setJuniorPool(true);
                      }}
                    >
                      <button className="text-md font-semibold  px-4 py-2    transition ease-in duration-150 text-sm  text-white bg-fil-secondary border-2 border-white  hover:scale-110  ">
                        Junior Pool
                      </button>
                    </div>

                    <div
                      className="absolute top-16 left-56 "
                      onClick={() => {
                        setJuniorPool(false);
                      }}
                    >
                      <button className="text-md font-semibold   bg-white px-4 py-2 border-2 text-fil-secondary   transition ease-in duration-150 text-sm     hover:scale-110    ">
                        Senior Pool
                      </button>
                    </div>

                    <div className=" items-center w-4/12   justify-center">
                      <p className="text-white    border-white   justify-center items-center  mt-6">
                        A pool which returns higher interest rate but with a
                        greater chance of loss if the loan becomes default
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
                          <h2 className="border-2 px-8 text-center ">
                            --/--/--
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div className="h-20"></div>
                  </div>
                </Fade>
              </>
            )}

            {/* Form */}
            <div className=" flex  justify-center items-center     ">
              <div className="flex flex-col   py-16 w-1/4 space-y-6 justify-start items-center  shadow-black rounded-xl -mt-24 bg-white shadow-md   ">
                <div className="flex  text-sm space-x-10      text-black rounded-sm  bg-white     ">
                  <div className=" font-light pr-5"> Amount</div>
                  <div className="    border-2  border-fil-primary rounded-md px-16 py-3  font-light "></div>
                </div>

                <div className="flex  text-sm space-x-10   items-center text-black rounded-sm bg-white   ">
                  <div className=" font-light"> Loan Duration</div>
                  <div className=" border-2  border-fil-primary rounded-md px-16 py-3 font-light "></div>
                </div>

                <div className="mt-6">
                  <button className="text-md font-semibold   bg-fil-secondary px-16 py-2 text-white rounded-lg transition ease-in duration-150 text-sm hover:scale-110">
                    Stake
                  </button>
                </div>
              </div>
            </div>

            {/* Dashboard */}

            <div className="flex flex-col rounded-xl border-2 mt-24  pb-24 pl-8">
              <h1 className="text-3xl m-8 text-black font-semibold">
                Dashboard
              </h1>

              <div className="grid-cols-9   px-4 grid">
                <div>S.No</div>
                <div>Pool Type</div>
                <div>Lend Amount</div>
                <div>Total Return</div>
                <div>Interest Rate</div>
                <div>Lending Date</div>
                <div>End Date</div>
                <div>Status</div>
                <div>Transaction</div>
              </div>

              <LenderLoan
                SerialNo={1}
                PoolType={"Junior Pool"}
                LendAmount={"200 FIL"}
                TotalReturn={"300 FIL"}
                InterestRate={"30%"}
                LendingDate={"04/09/2023"}
                EndingDate={"04/09/2024"}
                Status={"Active"}
                active={true}
              />

              <LenderLoan
                SerialNo={2}
                PoolType={"Senior Pool"}
                LendAmount={"200 FIL"}
                TotalReturn={"300 FIL"}
                InterestRate={"30%"}
                LendingDate={"04/09/2023"}
                EndingDate={"04/09/2024"}
                Status={"Completed"}
                active={false}
              />

              <LenderLoan
                SerialNo={3}
                PoolType={"Senior Pool"}
                LendAmount={"200 FIL"}
                TotalReturn={"300 FIL"}
                InterestRate={"30%"}
                LendingDate={"04/09/2023"}
                EndingDate={"04/09/2024"}
                Status={"Active"}
                active={true}
              />

              <LenderLoan
                SerialNo={4}
                PoolType={"Senior Pool"}
                LendAmount={"200 FIL"}
                TotalReturn={"300 FIL"}
                InterestRate={"30%"}
                LendingDate={"04/09/2023"}
                EndingDate={"04/09/2024"}
                Status={"Active"}
                active={true}
              />
            </div>

            <Image src={waves} />
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

{
  /* Headings */
}
{
  /* <div className="mt-4 mx-auto w-full text-sm flex justify-around border-2 items-center text-black font-medium ">
                <div>S.No</div>
                <div>Pool Type</div>
                <div>Lend Amount</div>
                <div>Total Return</div>
                <div>Interest Rate</div>
                <div>Lending Date</div>
                <div>End Date</div>
                <div>Status</div>
                <div>Transaction</div>
              </div>

              <div className="mt-4 mx-auto w-full text-lg flex justify-around border-2 items-center text-black font-medium ">
                <div>1</div>
                <div>Junior Pool</div>
                <div>200 FIL</div>
                <div>300 FIL</div>
                <div>30 %</div>
                <div>08/02/2023</div>
                <div>08/02/2024</div>
                <div>
                  <button className="text-md font-semibold  bg-puprle px-4 py-2 text-white rounded-lg transition ease-in duration-150 text-sm hover:scale-110">
                    Active
                  </button>
                </div>
                <div>
                  {" "}
                  <button className="text-md font-semibold  bg-fil-brown px-4 py-2 text-white rounded-lg transition ease-in duration-150 text-sm hover:scale-110">
                    Details
                  </button>
                </div>
              </div> */
}

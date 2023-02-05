/** @format */

import React from "react";
import Fade from "react-reveal/Fade";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import LenderLoan from "@/components/LenderLoan";
import Loading from "@/components/Loading";
import waves from "@/public/Images/waves.svg";
import Image from "next/image";
import svg from "@/public/Images/loan.svg";
import svg2 from "@/public/Images/vault.svg";

const address = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
        <Navbar button={true} curretLink={2} />
      </Fade>

      <>
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
                <div className="h-10"></div>
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
                  Status={"Active "}
                  active={true}
                />
              </div>

              <Image src={waves} />
            </Fade>
          </>
        )}
      </>
    </>
  );
};

export default address;

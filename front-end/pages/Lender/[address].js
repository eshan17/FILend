/** @format */

import React from "react";
import Fade from "react-reveal/Fade";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import waves from "@/public/Images/waves.svg";
import svg from "@/public/Images/loan.svg";
import svg2 from "@/public/Images/vault.svg";
import Image from "next/image";
import LenderLoan from "@/components/LenderLoan";
import {
  connectJuniorVault,
  connectSeniorVault,
  connectmockErc,
  connectLoanManager,
  connectlenderVault,
} from "@/utils/connectContract";
import { format, addMonths } from "date-fns";

import axios from "axios";
import { ethers } from "ethers";

const { BigNumber } = require("ethers");

export async function getServerSideProps(context) {
  const res = await fetch("http://localhost:3000/LenderData", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  return {
    props: {
      lendersData: data,
    },
  };
}

const address = ({ lendersData }) => {
  const router = useRouter();
  const { address, isConnecting, isDisconnected, isConnected, isReconnecting } =
    useAccount();
  const [loading, setLoading] = useState(true);
  const [juniorPool, setJuniorPool] = useState(true);
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const minAmount = 100;

  const [j_amount, setJuniorAmount] = useState(0);
  const [j_interestRate, setJuniorInterestRate] = useState(30);
  const [j_totalReturn, setJuniorTotalReturn] = useState(0);

  const [s_amount, setSeniorAmount] = useState(0);
  const [s_interestRate, setSeniorInterestRate] = useState(20);
  const [s_totalReturn, setSeniorTotalReturn] = useState(0);

  const [months, setMonths] = useState(12);
  const [date, setDate] = useState("--/--/----");
  const [duration, setDuration] = useState(18);

  const currentdate = new Date().toLocaleDateString();

  function increaseBy30Percent(value) {
    console.log("value before =" + value);
    let product = value * 0.3;
    let sum = Number(product) + Number(value);
    return sum;
  }

  function increaseBy20Percent(value) {
    console.log("value before =" + value);
    let product = value * 0.2;
    let sum = Number(product) + Number(value);
    return sum;
  }

  const dateChange = (event) => {
    event.preventDefault();

    if ("12 Months" === event.target.value) {
      setMonths(12);
      setDuration(12);
    }

    if ("18 Months" === event.target.value) {
      setMonths(18);
      setDuration(12);
    }

    const currentDate = new Date();
    const futureDate = addMonths(currentDate, months);
    const formattedDate = format(futureDate, "dd/MM/yyyy");
    setDate(formattedDate);
  };

  const J_handleChange = (event) => {
    setJuniorAmount(event.target.value);

    setJuniorTotalReturn(Math.round(increaseBy30Percent(event.target.value)));
  };

  const S_handleChange = (event2) => {
    setSeniorAmount(event2.target.value);
    setSeniorTotalReturn(Math.round(increaseBy20Percent(event2.target.value)));
  };

  const handleSubmit1 = (event) => {
    event.preventDefault();
    setShowModal(true);
  };

  async function handleSubmit2(event) {
    console.log("confirm button clicked");
    event.preventDefault();

    const LoanManagerContract = await connectLoanManager();
    const JuniorVaultContract = await connectJuniorVault();
    const lenderVaultContract = await connectlenderVault();

    const mockErcContract = await connectmockErc();

    try {
      if (mockErcContract && JuniorVaultContract) {
        const txn1 = await mockErcContract.wrapAndApproveTo(address, {
          value: ethers.utils.parseEther(j_amount),
          gasLimit: 22000000,
        });

        let wait1 = await txn1.wait();
        console.log("Minting...", txn1.hash);

        console.log("Minted -- ", txn1.hash);

        const txn2 = await JuniorVaultContract.deposit(
          ethers.utils.parseEther(j_amount),
          address,
          { gasLimit: 22000000 }
        );

        setShowModal(false);

        let wait2 = await txn2.wait();
        console.log("Minting...", txn2.hash);

        console.log("Minted -- ", txn2.hash);

        const data = {
          Address: address,
          poolType: "Junior Pool",
          Amount: j_amount,
          LoanDuration: duration,
          TotalReturn: j_totalReturn,
          InterestRate: j_interestRate,
          RepaymentDate: date,
          LendingDate: currentdate,
          Tx: txn1.hash,
        };

        axios
          .post("http://localhost:3000/LenderData", data)
          .then((response) => {
            console.log(response.body);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (e) {
      console.log("error :" + e);
    }
  }

  async function handleSubmit3(event) {
    console.log("confirm button clicked");
    event.preventDefault();

    const SeniorVaultContract = await connectSeniorVault();
    const mockErcContract = await connectmockErc();

    try {
      if (mockErcContract) {
        const txn1 = await mockErcContract.wrapAndApproveTo(address, {
          value: ethers.utils.parseEther(s_amount),
          gasLimit: 22000000,
        });

        // const txn2 = await SeniorVaultContract.deposit(
        //   ethers.utils.parseEther(j_amount),
        //   address,
        //   { gasLimit: 22000000 }
        // );

        console.log("Minting...", txn1.hash);
        let wait1 = await txn1.wait();
        console.log("Minted -- ", txn1.hash);

        // let wait2 = await txn2.wait();
        // console.log("Minting...", txn2.hash);
        // setShowModal(false);
        // console.log("Minted -- ", txn2.hash);

        const data = {
          Address: address,
          poolType: "Senior Pool",
          Amount: s_amount,
          LoanDuration: duration,
          TotalReturn: s_totalReturn,
          InterestRate: s_interestRate,
          RepaymentDate: date,
          LendingDate: currentdate,
          Tx: txn1.hash,
        };

        axios
          .post("http://localhost:3000/LenderData", data)
          .then((response) => {
            console.log(response.body);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (e) {
      console.log("error :" + e);
    }
  }
  console.table(lendersData);

  useEffect(() => {
    setTimeout(() => {
      setData({ message: "Data loaded" });
      const currentDate = new Date();
      const futureDate = addMonths(currentDate, 18);
      const formattedDate = format(futureDate, "dd/MM/yyyy");
      setDate(formattedDate);
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
                  <div
                    className={` modal-open ${
                      showModal ? "" : ""
                    } bg-fil-secondary w-screen border-white text-white flex flex-col justify-center items-center container mx-auto py-20`}
                  >
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
                          <h2 className="border-2 px-8 text-center ">
                            {j_interestRate}
                          </h2>
                        </div>

                        <div className="flex-col space-y-2">
                          <h2>Total Return</h2>
                          <h2 className="border-2 px-8 text-center ">
                            {j_totalReturn} FIL
                          </h2>
                        </div>

                        <div className="flex-col space-y-2">
                          <h2>Repayment Date</h2>
                          <h2 className="border-2 px-8 text-center ">{date}</h2>
                        </div>
                      </div>
                    </div>
                    <div className="h-20"></div>
                    <>
                      {showModal && (
                        <>
                          <Fade>
                            <div
                              className={`bg-white py-5 blur-none -mt-8 h-96 z-50 md:filter-none  
                              px-16 relative flex flex-col   w-modal space-y-2  border-2 border-black  shadow-black rounded-xl `}
                            >
                              {/* Left side */}
                              <div classname="  flex  border-black">
                                <div className="text-black text-xl    ">
                                  <Image src={svg} width={30} height={30} />
                                </div>

                                <div className="text-black text-xl  font-semibold ">
                                  Loan Receipt
                                </div>

                                <div className="flex flex-row mt-4   space-x-6">
                                  <div className="flex flex-col   text-sm space-y-3  text-black font-medium">
                                    <div>Amount</div>
                                    <div>Loan Duration</div>
                                    <div>Total Return</div>
                                    <div>Interest Rate</div>
                                    <div>Repayment Date</div>
                                    <div>Lending Date</div>
                                  </div>

                                  <div className="flex flex-col   text-sm space-y-3  text-black font-medium">
                                    <div>{j_amount}</div>
                                    <div>{duration}-Months</div>
                                    <div>{j_totalReturn}</div>
                                    <div>{j_interestRate}</div>
                                    <div>{date}</div>
                                    <div>{currentdate}</div>
                                  </div>

                                  <div className="  absolute top-24 right-4">
                                    <Image
                                      src={svg2}
                                      width={220}
                                      height={300}
                                      alt={"a money safe"}
                                    />
                                  </div>
                                </div>
                              </div>

                              <form onSubmit={handleSubmit2}>
                                <div className="flex flex-row w-full   justify-center pb-8 space-x-12 items-center transition ease-in duration-150 ">
                                  <button
                                    onClick={() => setShowModal(false)}
                                    className="bg-black px-8 py-1 mt-10 text-white rounded-md"
                                  >
                                    Close
                                  </button>

                                  <button
                                    type="submit"
                                    className="bg-fil-primary px-8 py-1 mt-10 text-white rounded-md"
                                  >
                                    confirm
                                  </button>
                                </div>
                              </form>
                            </div>
                          </Fade>
                        </>
                      )}
                    </>
                  </div>

                  {/* Form */}
                  <div className={` flex  justify-center items-center z-10`}>
                    <div
                      className={`flex flex-col  ${
                        showModal ? "blur mt-12" : ""
                      }  py-16 w-1/4 space-y-6 justify-center items-center  shadow-black rounded-xl -mt-24 bg-white shadow-md  `}
                    >
                      <form
                        className="space-y-6   justify-center items-center"
                        onSubmit={handleSubmit1}
                      >
                        <div className="flex  text-sm justify-between items-center space-x-10 text-black rounded-sm  bg-white     ">
                          <div className=" font-light  w-16"> Amount</div>

                          <input
                            className="border-2 border-black focus:border-fil-primary rounded-md px-4 py-1 font-medium"
                            id="title"
                            type="number"
                            required
                            min={0}
                            onChange={J_handleChange}
                            placeholder="100 FIL"
                          />
                        </div>

                        <div className="flex  text-sm space-x-10   items-center text-black rounded-sm bg-white   ">
                          <div className="font-light w-16"> Loan Duration</div>

                          <select
                            required
                            className="border-2 border-black focus:border-fil-primary rounded-md px-4 py-1  font-medium"
                            onChange={dateChange}
                          >
                            <option value="18 Months">18 Months</option>
                            <option value="12 Months">12 months</option>
                          </select>
                        </div>

                        <div className="justify-center items-center flex ">
                          <button
                            type="submit"
                            className="text-md font-semibold  mt-8 bg-fil-secondary px-16 py-2 text-white rounded-lg transition ease-in duration-150 text-sm hover:scale-110"
                          >
                            Lend
                          </button>
                        </div>
                      </form>
                    </div>
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
                        A pool which returns lower interest rate but it is
                        secure , safe and has a loan chance of losing liquidity
                      </p>

                      <div className="flex mt-12 items-center justify-center space-x-8">
                        <div className="flex-col space-y-2">
                          <h2>Interest Rate</h2>
                          <h2 className="border-2 px-8 text-center ">
                            {s_interestRate}
                          </h2>
                        </div>

                        <div className="flex-col space-y-2">
                          <h2>Total Return</h2>
                          <h2 className="border-2 px-8 text-center ">
                            {s_totalReturn} FIL
                          </h2>
                        </div>

                        <div className="flex-col space-y-2">
                          <h2>Repayment Date</h2>
                          <h2 className="border-2 px-8 text-center ">{date}</h2>
                        </div>
                      </div>
                    </div>
                    <div className="h-20"></div>
                    <>
                      {showModal && (
                        <>
                          <Fade>
                            <div
                              className={`bg-white py-5 blur-none -mt-8 h-96 z-50 md:filter-none  
                              px-16 relative flex flex-col   w-modal space-y-2  border-2 border-black  shadow-black rounded-xl `}
                            >
                              <div classname="  flex  border-black">
                                <div className="text-black text-xl    ">
                                  <Image src={svg} width={30} height={30} />
                                </div>

                                <div className="text-black text-xl  font-semibold ">
                                  Loan Receipt
                                </div>

                                <div className="flex flex-row mt-4   space-x-6">
                                  <div className="flex flex-col   text-sm space-y-3  text-black font-medium">
                                    <div>Amount</div>
                                    <div>Loan Duration</div>
                                    <div>Total Return</div>
                                    <div>Interest Rate</div>
                                    <div>Repayment Date</div>
                                    <div>Lending Date</div>
                                  </div>

                                  <div className="flex flex-col   text-sm space-y-3  text-black font-medium">
                                    <div>{s_amount}</div>
                                    <div>{duration}-Months</div>
                                    <div>{s_totalReturn}</div>
                                    <div>{s_interestRate}</div>
                                    <div>{date}</div>
                                    <div>{currentdate}</div>
                                  </div>

                                  <div className="  absolute top-24 right-4">
                                    <Image
                                      src={svg2}
                                      width={220}
                                      height={300}
                                      alt={"a money safe"}
                                    />
                                  </div>
                                </div>
                              </div>

                              <form onSubmit={handleSubmit3}>
                                <div className="flex flex-row w-full   justify-center pb-8 space-x-12 items-center transition ease-in duration-150 ">
                                  <button
                                    onClick={() => setShowModal(false)}
                                    className="bg-black px-8 py-1 mt-10 text-white rounded-md"
                                  >
                                    Close
                                  </button>

                                  <button
                                    type="submit"
                                    className="bg-fil-primary px-8 py-1 mt-10 text-white rounded-md"
                                  >
                                    confirm
                                  </button>
                                </div>
                              </form>
                            </div>
                          </Fade>
                        </>
                      )}
                    </>
                  </div>

                  {/* Form */}
                  <div className={` flex  justify-center items-center z-10`}>
                    <div
                      className={`flex flex-col  ${
                        showModal ? "blur mt-12" : ""
                      }  py-16 w-1/4 space-y-6 justify-center items-center  shadow-black rounded-xl -mt-24 bg-white shadow-md  `}
                    >
                      <form
                        className="space-y-6   justify-center items-center"
                        onSubmit={handleSubmit1}
                      >
                        <div className="flex  text-sm justify-between items-center space-x-10 text-black rounded-sm  bg-white     ">
                          <div className=" font-light  w-16"> Amount</div>

                          <input
                            className="border-2 border-black focus:border-fil-primary rounded-md px-4 py-1 font-medium"
                            id="title"
                            type="number"
                            required
                            min={0}
                            onChange={S_handleChange}
                            placeholder="100 FIL"
                          />
                        </div>

                        <div className="flex  text-sm space-x-10   items-center text-black rounded-sm bg-white   ">
                          <div className="font-light w-16"> Loan Duration</div>

                          <select
                            required
                            className="border-2  border-black focus:border-fil-primary rounded-md px-4 py-1  font-medium"
                            onChange={dateChange}
                          >
                            <option value="18 Months">18 Months</option>
                            <option value="12 Months">12 months</option>
                          </select>
                        </div>

                        <div className="justify-center items-center flex ">
                          <button
                            type="submit"
                            className="text-md font-semibold  mt-8 bg-fil-secondary px-16 py-2 text-white rounded-lg transition ease-in duration-150 text-sm hover:scale-110"
                          >
                            Lend
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </Fade>
              </>
            )}

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

              {lendersData &&
                lendersData
                  .filter((loan) => loan.Address === address)
                  .map((loan, index) => (
                    <Fade>
                      <LenderLoan
                        key={index}
                        SerialNo={index + 1}
                        PoolType={loan.poolType}
                        LendAmount={`${loan.Amount} FIL`}
                        TotalReturn={`${loan.TotalReturn} FIL`}
                        InterestRate={`${loan.InterestRate}`}
                        LendingDate={loan.LendingDate}
                        EndingDate={loan.RepaymentDate}
                        Status={"Active"}
                        active={true}
                        Tx={loan.Tx}
                      />
                    </Fade>
                  ))}
            </div>

            <Image src={waves} alt={"blue waves"} />
          </Fade>
        </>
      )}
    </>
  );
};

export default address;

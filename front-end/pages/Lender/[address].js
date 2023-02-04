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
import { format, addMonths } from "date-fns";
// import axios from "axios";
import axios from "axios";

const address = () => {
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
  const [s_interestRate, setSeniorInterestRate] = useState(30);
  const [s_totalReturn, setSeniorTotalReturn] = useState(0);

  const [error, setError] = useState(false);

  const [months, setMonths] = useState(12);
  const [date, setDate] = useState("--/--/----");
  const [duration, setDuration] = useState("18 months");
  let opacity = 100;

  const currentdate = new Date().toLocaleDateString();

  const dateChange = (event) => {
    event.preventDefault();

    if ("12 Months" === event.target.value) {
      setMonths(12);
      setDuration("12 months");
    }

    if ("18 Months" === event.target.value) {
      setMonths(18);
      setDuration("18 months");
    }

    const currentDate = new Date();
    const futureDate = addMonths(currentDate, months);
    const formattedDate = format(futureDate, "dd/MM/yyyy");
    setDate(formattedDate);
  };

  const J_handleChange = (event) => {
    setJuniorAmount(event.target.value);
    setJuniorTotalReturn(event.target.value * 1.5);
  };

  const S_handleChange = (event2) => {
    setSeniorAmount(event2.target.value);
    setSeniorTotalReturn(event2.target.value * 1.5);
  };

  const handleSubmit1 = (event) => {
    event.preventDefault();
    setShowModal(true);
  };

  const sendData = async (address, lender) => {
    try {
      const response = await axios.post("/api/lenders-data", {
        address,
        lender,
      });

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  async function getData() {
    try {
      const response = await axios.get("/api/lenders-data");

      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSubmit2(event) {
    console.log("confirm button clicked");
    event.preventDefault();
    const body = {
      Amount: j_amount,
      LoanDuration: duration,
      TotalReturn: j_totalReturn,
      InterestRate: j_interestRate,
      RepaymentDate: date,
      LendingDate: currentdate,
    };

    
    // sendData(address, body);

    // try {
    //   const sendresponse = await axios.post("/api/data", {
    //     j_amount,
    //   });

    //   console.log("send" + sendresponse.data);
    // } catch (error) {
    //   console.error(error);
    // }

    // const data = getData();
    // console.log("data = " + data);

    // try {
    //   const response = await fetch("/api/store-event-data", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(body),
    //   });
    //   if (response.status !== 200) {
    //     alert("Oops! Something went wrong . Please refresh and try again.");
    //   } else {
    //     console.log("Form successfully submitted!");
    //     let responseJSON = await response.json();
    //     console.log(responseJSON.cid);
    //     console.log("Responce ", responseJSON);
    //     axios
    //       .get(`https://web3.storage/ipfs/${cid}`)
    //       .then((response) => {
    //         const data = response.data;
    //         // use the data as needed
    //       })
    //       .catch((error) => {
    //         console.error(error);
    //       });

    //     // console.log("Responce body ", responseJSON.body);
    //     // console.log("Responce LoanDuration ", responseJSON.LoanDuration);
    //     // console.log("Responce TotalReturn", responseJSON.TotalReturn);
    //     // console.log("Responce InterestRate ", responseJSON.InterestRate);
    //     // console.log("Responce RepaymentDate ", responseJSON.RepaymentDate);
    //     // console.log("Responce LendingDat ", responseJSON.LendingDate);

    //     // await createEvent(responseJSON.cid);
    //   }
    //   // check response, if success is false, dont take them to success page
    // } catch (error) {
    //   alert(
    //     ` catch Oops! Something went wrong. Please refresh and try again. Error ${error}`
    //   );
    // }
  }

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
                    className={`opacity-${opacity} modal-open ${
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
                              {/* <h1 className="text-3xl justify-center items-center text-fil-primary font-bold">
                            Lend Loan
                          </h1> */}

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
                                    <div>{duration}</div>
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
                            min={minAmount}
                            onChange={J_handleChange}
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
                            // onClick={() => setShowModal(true)}
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
                          <h2 className="border-2 px-8 text-center ">30</h2>
                        </div>

                        <div className="flex-col space-y-2">
                          <h2>Total Return</h2>
                          <h2 className="border-2 px-8 text-center ">
                            {s_totalReturn} FIL
                          </h2>
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

                  {/* Form */}
                  <div className=" flex  justify-center items-center     ">
                    <div className="flex flex-col   py-16 w-1/4 space-y-6 justify-center items-center  shadow-black rounded-xl -mt-24 bg-white shadow-md   ">
                      <form className="space-y-6   justify-center items-center">
                        <div className="flex  text-sm justify-between items-center space-x-10 text-black rounded-sm  bg-white     ">
                          <div className=" font-light  w-16"> Amount</div>

                          <input
                            className="border-2  border-fil-primary rounded-md px-4 py-1 font-medium"
                            id="title"
                            type="number"
                            min={minAmount}
                            required
                            value={s_amount}
                            onChange={S_handleChange}
                            placeholder="1000 FIL"
                          />
                        </div>

                        <div className="flex  text-sm space-x-10   items-center text-black rounded-sm bg-white   ">
                          <div className="font-light w-16"> Loan Duration</div>

                          <select className="border-2  border-fil-primary rounded-md px-4 py-1 font-medium">
                            <option value="12 Months">12 months</option>
                            <option value="18 Months">18 Months</option>
                          </select>
                        </div>

                        <div className="justify-center items-center flex ">
                          <button className="text-md font-semibold  mt-8 bg-fil-secondary px-16 py-2 text-white rounded-lg transition ease-in duration-150 text-sm hover:scale-110">
                            Stake
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

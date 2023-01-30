/** @format */
// Components
import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/Button.js";
import Footer from "@/components/footer.jsx";
import Loading from "@/components/Loading";

// Libraries
import Fade from "react-reveal/Fade";
import { useRouter } from "next/router";
import {
  Link,
  DirectLink,
  Element,
  Events,
  animateScroll as scroll,
  scrollSpy,
  scroller,
} from "react-scroll";
import { useEffect, useState } from "react";

// Images
import img1 from "../public/Images/img.svg";
import img3 from "../public/Images/img3.svg";
import waves from "../public/Images/waves.svg";
import sp1 from "../public/Images/miner.svg";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch data here, for example:
    setTimeout(() => {
      setData({ message: "Data loaded" });
      setLoading(false);
    }, 500);
  }, []);

  const router = useRouter();

  const lenderPage = () => {
    router.push("/Lender");
  };
  const borrowerPage = () => {
    router.push("/Borrower");
  };
  var Scroll = require("react-scroll");

  return (
    <>
      <div>
        <Fade top>
          <Navbar button={true} curretLink={0} />
        </Fade>
      </div>
      {/* Home section */}

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex   mt-16  py-2  ">
            <Fade bottom>
              {/* Left side */}
              <div className="flex flex-col items-start mx-12  ml-24  space-y-6  w-9/12">
                <div>
                  <h1 className="text-6xl font-bold max-w-3xl   ">
                    Undercollaterized <a className="text-fil-primary">Loan</a>{" "}
                    for Storage providers
                  </h1>
                </div>

                <div>
                  <p className="text-xl font-normal leading-9 text-gray-500 w-10/12">
                    FilLend is an undercollaterized loan protocol. Which
                    provides loan to the storage providers on the filecoin
                    network to put up collateral and make as much storage deals
                    as possible
                  </p>
                </div>

                <div
                  className="items-left justify-start"
                  onClick={() => scroll.scrollTo(800)}
                >
                  <Button {...{ text: "Get Started" }} />
                </div>
              </div>
            </Fade>

            {/* Right side */}
            <Fade right>
              <div className="flex flex-col items-center p-4   justify-center w-8/12  ">
                <Image className=" -mt-24  " src={img1}></Image>
              </div>
            </Fade>
          </div>

          {/*Stats Bar  */}
          <Fade bottom>
            <div className="flex py-5 justify-around mx-auto mt-5 items-center bg-fil-primary   ">
              <div className="flex flex-col  space-y-3  w-auto mx-auto  ">
                <h2 className="text-3xl font-bold text-white">Total Lenders</h2>
                <h2 className="text-5xl font-bold text-white">5K +</h2>
              </div>

              <div className="flex flex-col  space-y-3 w-auto mx-auto ">
                <h2 className="text-3xl font-bold text-white">Amount Staked</h2>
                <h2 className="text-5xl font-bold text-white">500K $ +</h2>
              </div>

              <div className="flex flex-col  space-y-3    w-auto   mx-auto">
                <h2 className="text-3xl font-bold text-white">Liquidity</h2>
                <h2 className="text-5xl font-bold text-white">1 million $ +</h2>
              </div>
            </div>
          </Fade>

          {/* Miner section */}

          {/* Left side */}
          <div className="flex   py-2  ">
            <Fade left>
              <div className="flex flex-col items-center p-4  mr-24  justify-center w-4/12 h-auto ">
                <Image src={sp1} />
              </div>
            </Fade>

            {/* Right side */}
            <div className="flex mt-36 flex-col items-start mx-12   space-y-6  w-7/12">
              <Fade bottom>
                <div>
                  <h1 className="text-6xl font-bold max-w-3xl   ">
                    Borrow loan with collateral as low as{" "}
                    <a className="text-fil-primary">10% </a>
                  </h1>
                </div>

                <div>
                  <p className="text-xl font-normal leading-9 text-gray-500 w-9/12">
                    FilLend is an undercollaterized loan protocol. Which
                    provides loan to the storage providers on the filecoin
                    network to put up collateral and make as much storage deals
                    as possible.
                    <a className="text-fil-primary"> Apply </a> for a loan
                  </p>
                </div>

                <div
                  className="items-left justify-start"
                  onClick={borrowerPage}
                >
                  <Button {...{ text: "Apply for Loan" }} />
                </div>
              </Fade>
            </div>
          </div>

          <Fade>
            <>
              <Image src={waves} />
            </>
          </Fade>
          {/* Home section */}
          <div className="flex mt-36  py-2  ">
            {/* Left side */}
            <div className="flex flex-col items-start mx-12  ml-24  space-y-6  w-9/12">
              <Fade bottom>
                <div>
                  <h1 className="text-6xl font-bold max-w-3xl   ">
                    Become a <a className="text-fil-primary"> Lender</a> and
                    Earn interest up to <a className="text-fil-primary"> 30%</a>
                  </h1>
                </div>

                <div>
                  <p className="text-xl font-normal leading-9 text-gray-500 w-10/12">
                    FilLend is an undercollaterized loan protocol. Which
                    provides loan to the storage providers on the filecoin
                    network to put up collateral and make as much storage deals
                    as possible . Become a
                    <a className="text-fil-primary"> Lender</a>
                  </p>
                </div>

                <div className="items-left justify-start" onClick={lenderPage}>
                  <Button {...{ text: "Become a Lender" }} />
                </div>
              </Fade>
            </div>

            {/* Right side */}
            <Fade right>
              <div className="flex flex-col items-center p-4   justify-center w-8/12  ">
                <Image className=" -mt-24  " src={img3}></Image>
              </div>
            </Fade>
          </div>

          {/* Footer */}

          <Fade bottom>
            <>
              <Footer />
            </>
          </Fade>
        </>
      )}
    </>
  );
}

/** @format */

import React from "react";
import Navbar from "@/components/Navbar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Fade from "react-reveal/Fade";
import Image from "next/image";
import img from "@/public/Images/img7.svg";
import waves from "@/public/Images/waves.svg";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

const index = () => {
  const router = useRouter();
  const { address, isConnecting, isDisconnected, isConnected } = useAccount();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  useEffect(() => {
    setTimeout(() => {
      setData({ message: "Data loaded" });
      setLoading(false);
    }, 500);

    if (isConnected) {
      router.push(`/Borrower/${address}`);
    }
  }, [isConnecting, isConnected]);

  return (
    <>
      <Fade top>
        <Navbar button={true} curretLink={2} />
      </Fade>

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="container flex flex-col justify-center items-center  ">
            <Fade bottom>
              <div>
                <Image src={img} alt="computer" width={400} height={400} />
              </div>
              <div className=" -mt-6"></div>

              <div className="text-sm font-light leading-9 mt-6 text-gray-400  ">
                Verify that you are a storage provider on the Filecoin Network
              </div>

              <div className="mt-6">
                <button className="text-md font-semibold  bg-black px-6 py-2 text-white rounded-lg transition ease-in duration-150 text-sm hover:scale-110">
                  Verify
                </button>
              </div>
            </Fade>
            <Image src={waves} />
          </div>
        </>
      )}
    </>
  );
};

export default index;

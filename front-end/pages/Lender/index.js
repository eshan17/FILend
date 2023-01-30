/** @format */

import React from "react";
import Navbar from "@/components/Navbar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Fade from "react-reveal/Fade";
import Image from "next/image";
import img from "@/public/Images/img4.svg";
import waves from "@/public/Images/wave.svg";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
// width={200}
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
      router.push(`/Lender/${address}`);
    }
  }, [isConnecting, isConnected]);

  return (
    <>
      <Fade top>
        <Navbar button={false} curretLink={1} />
      </Fade>

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="container flex flex-col justify-center items-center  ">
            <Fade bottom>
              <div>
                <Image src={img} alt="computer" width={600} height={600} />
              </div>
              <div className=" -mt-6">
                <ConnectButton />
              </div>

              <div className="text-sm font-light leading-9 mt-6 text-gray-400  ">
                Connect your wallet to get started
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

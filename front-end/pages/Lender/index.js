/** @format */

import React from "react";
import Navbar from "@/components/Navbar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Fade from "react-reveal/Fade";
import Image from "next/image";
import img from "@/public/Images/img4.svg";
import waves from "@/public/Images/waves.svg";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import { useEffect } from "react";
// width={200}
const index = () => {
  const router = useRouter();
  const { address, isConnecting, isDisconnected, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      router.push(`/Lender/${address}`);
    }
  }, [isConnecting, isConnected]);

  return (
    <>
      <Fade top>
        <Navbar button={false} />
      </Fade>

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
  );
};

export default index;

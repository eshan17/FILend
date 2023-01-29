/** @format */

import React from "react";
import Fade from "react-reveal/Fade";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";

const address = () => {
  const router = useRouter();
  const { address, isConnecting, isDisconnected, isConnected, isReconnecting } =
    useAccount();
  useEffect(() => {
    if (isDisconnected) {
      router.push(`/Borrower`);
    }
  }, [isConnecting, isConnected]);

  return (
    <>
      {" "}
      <Fade top>
        <Navbar button={true} />
      </Fade>
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

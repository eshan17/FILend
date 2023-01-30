import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Navbar from "../components/Navbar.jsx";
import { Button } from "@/components/Button.js";
import desktop from "../public/Images/desktop.png";
import waves from "../public/Images/waves.svg";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Fade from "react-reveal/Fade";

export default function Lenders() {
    return (
        <>
        <Navbar button={false} />
        <div className="flex flex-col justify-center items-center py-2">
        <Image src={desktop} />  

        <Fade top>
            <ConnectButton/>
        </Fade>
        <p className="font-normal leading-9 text-gray-500 py-2">
            Connect your wallet to get started
        </p>
        </div>
  
        <Image src={waves} />  
      </>
    )
  }
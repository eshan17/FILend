import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Navbar from "../components/Navbar.jsx";
import { Button } from "@/components/Button.js";
import wallet from "../public/Images/wallet.png";
import waves from "../public/Images/waves.svg";

export default function Borrowers() {
    return (
        <>
        <Navbar button={true}/>  
        <div className="flex flex-col justify-center items-center py-2">
        <Image src={wallet} />  
        <p className="font-normal leading-9 text-gray-500 py-2">
        Verify that you are a storage provider on the Filecoin Network
        </p>
        <button className="bg-black-500 hover:bg-black-700 text-white font-bold py-2 px-4 rounded-lg">
          Verify
        </button>
        </div>
  
        <Image src={waves} />  
      </>
    )
  }
/** @format */

import LoanManagerAbiJSON from "./loanManager.json";
import juniorVaultAbiJSON from "./juniorVault.json";
import seniorVaulAbiJSON from "./seniorVault.json";
import mockErcAbiJSON from "./mockErc.json";

import { ethers } from "ethers";

//Note: Your contractAddress will start with 0x, delete everything between the quotes and paste your contract address.
const lenderVaultAddress = "0xF57727359b8947eD163253D9c7721582a6614E82";
const mockErcAddress = "0x922BA67974f1e66F79Df0E8Ca12Da3FCAf336B06";
const lenderVaultJunior = "0x26d98E799CCE56cb39FF8E02C66521437De23487";
const lenderVaultSenior = "0xe45DcE80E9f6e7FD3d607a6817EbFaFCC2D21f9A";
const LoanManager = "0x86d563B776Bb148D56b244eF21762957cc5b5A79";

export async function connectJuniorVault() {
  const juniorVaultAbi = juniorVaultAbiJSON.abi;

  let juniorVaultContract;
  try {
    const { ethereum } = window;

    if (ethereum) {
      //checking for eth object in the window
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      juniorVaultContract = new ethers.Contract(
        lenderVaultJunior,
        juniorVaultAbi,
        signer
      ); // instantiating new connection to the contract
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log("ERROR:", error);
  }
  return juniorVaultContract;
}

export async function connectlenderVault() {
  const lenderVaultAbi = juniorVaultAbiJSON.abi;

  let lenderVaultContract;
  try {
    const { ethereum } = window;

    if (ethereum) {
      //checking for eth object in the window
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      lenderVaultContract = new ethers.Contract(
        lenderVaultAddress,
        lenderVaultAbi,
        signer
      ); // instantiating new connection to the contract
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log("ERROR:", error);
  }
  return lenderVaultContract;
}

export async function connectSeniorVault() {
  const SeniorVaultAbiJSON = seniorVaulAbiJSON.abi;

  let SeniorVaultContract;
  try {
    const { ethereum } = window;

    if (ethereum) {
      //checking for eth object in the window
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      SeniorVaultContract = new ethers.Contract(
        lenderVaultSenior,
        SeniorVaultAbiJSON,
        signer
      ); // instantiating new connection to the contract
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log("ERROR:", error);
  }
  return SeniorVaultContract;
}

export async function connectmockErc() {
  const mockErcAbi = mockErcAbiJSON.abi;

  let mockErcContract;
  try {
    const { ethereum } = window;

    if (ethereum) {
      //checking for eth object in the window
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      mockErcContract = new ethers.Contract(mockErcAddress, mockErcAbi, signer); // instantiating new connection to the contract
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log("ERROR:", error);
  }
  return mockErcContract;
}

export async function connectLoanManager() {
  const loancontractABI = LoanManagerAbiJSON.abi;

  let LenderContract;
  try {
    const { ethereum } = window;

    if (ethereum) {
      //checking for eth object in the window
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      LenderContract = new ethers.Contract(
        LoanManager,
        loancontractABI,
        signer
      ); // instantiating new connection to the contract
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log("ERROR:", error);
  }
  return LenderContract;
}

// async function connectContract() {
//   const loancontractABI = LoanManagerAbiJSON.abi;

//   let LenderContract;
//   try {
//     const { ethereum } = window;

//     if (ethereum) {
//       //checking for eth object in the window
//       const provider = new ethers.providers.Web3Provider(ethereum);
//       const signer = provider.getSigner();
//       LenderContract = new ethers.Contract(
//         LoanManager,
//         loancontractABI,
//         signer
//       ); // instantiating new connection to the contract
//     } else {
//       console.log("Ethereum object doesn't exist!");
//     }
//   } catch (error) {
//     console.log("ERROR:", error);
//   }
//   return LenderContract;
// }

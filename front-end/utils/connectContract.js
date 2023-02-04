/** @format */

import LoanManagerAbiJSON from "./loanManager.json";
import { ethers } from "ethers";

async function connectContract() {
  //Note: Your contractAddress will start with 0x, delete everything between the quotes and paste your contract address.
  const lenderVaultAddress = "0xF57727359b8947eD163253D9c7721582a6614E82";
  const mockErcAddress = "0xDDb6fCBd3e8922756a6Bb740775d12e46c217ea2";
  const lenderVaultJunior = "0xa2DE18B14eEF924A6E85B3afc28944103264a377";
  const lenderVaultSenior = "0xbaBC3e94092dCf1D52bc6dA709dc1674DaE71384";
  const LoanManager = "0xc9045434354f2B82bcBC58880536F4F5E8508521";

  const contractABI = LoanManagerAbiJSON.abi;

  let Contract;
  try {
    const { ethereum } = window;

    if (ethereum) {
      //checking for eth object in the window
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      Contract = new ethers.Contract(LoanManager, contractABI, signer); // instantiating new connection to the contract
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log("ERROR:", error);
  }
  return Contract;
}

export default connectContract;

import abiJSON from "./Web3RSVP.json";
import { ethers } from "ethers";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function connectContract() {
  const contractABI = abiJSON.abi;
  let rsvpContract;
  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      rsvpContract = new ethers.Contract(contractAddress, contractABI, signer);
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (err)  {
    console.log("ERROR:", err);
  }

  return rsvpContract;
}
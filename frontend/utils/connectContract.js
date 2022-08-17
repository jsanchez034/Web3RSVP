import abiJSON from "./Web3RSVP.json";
import { ethers } from "ethers";

export default function connectContract() {
  const contractAddress = "0x88FF77db118d551e24D06834612cFD27E6694e94";
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
    console.log("ERROR:", error);
  }

  return rsvpContract;
}
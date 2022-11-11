import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BigNumber, Contract } from "ethers";
import Link from "next/link";
import { useState } from "react";
import { useSigner } from "wagmi";

import nftAbi from "../abis/NFT.json";
import managerAbi from "../abis/FNFTManager.json";
import { parseEther } from "ethers/lib/utils";

export default function Home() {
  const [tokenAmount, setTokenAmount] = useState(BigNumber.from("0"));

  const { data: signer } = useSigner();

  const nftContract = new Contract(
    process.env.NEXT_PUBLIC_CONTRACT_NFT_ADDRESS!,
    nftAbi.abi,
    signer!
  );

  const managerContract = new Contract(
    process.env.NEXT_PUBLIC_CONTRACT_MANAGER_ADDRESS!,
    managerAbi.abi,
    signer!
  );

  async function requestApproval() {
    // Send approval transaction to NFT contract
    const approvalTxn = await nftContract.setApprovalForAll(
      process.env.NEXT_PUBLIC_CONTRACT_MANAGER_ADDRESS,
      true
    );
    await approvalTxn.wait();
  }

  async function fractionalizeNFT() {
    console.log(tokenAmount);

    const approvalTxn = await managerContract.fractionalize(
      process.env.NEXT_PUBLIC_CONTRACT_NFT_ADDRESS,
      1, // NFT token 1
      tokenAmount
    );
    await approvalTxn.wait();
  }

  return (
    <div>
      <div className="flex flex-row w-full py-3 px-20 items-center space-x-5">
        <Link
          href="/"
          className="hover:bg-blue-600 text-black hover:text-white rounded-xl p-3"
        >
          Home
        </Link>
        <Link
          href="/redeem"
          className="hover:bg-blue-600 text-black hover:text-white rounded-xl p-3"
        >
          Redeem
        </Link>
        <div className="grow"></div>
        <ConnectButton />
      </div>
      <div className="flex flex-col w-full min-h-screen bg-gray-200 p-20">
        <div className="flex flex-col w-1/4 mx-auto">
          <p>Request approval for the NFT Manager to transfer your NFT:</p>
          <button
            className="p-3 my-3 rounded-xl text-white bg-yellow-500 hover:bg-yellow-600"
            onClick={requestApproval}
          >
            Request Approval
          </button>
          <p className="mt-20">Fractionalize your NFT into ERC-20 tokens:</p>
          <input
            className="p-2 mt-3"
            type="number"
            placeholder="token amount"
            onChange={(e) => setTokenAmount(parseEther(e.target.value))}
          ></input>
          <button
            className="p-3 mt-3 rounded-xl text-white bg-yellow-500 hover:bg-yellow-600"
            onClick={fractionalizeNFT}
          >
            Fractionalize NFT
          </button>
        </div>
      </div>
      ;
    </div>
  );
}

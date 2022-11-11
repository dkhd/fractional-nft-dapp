import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BigNumber, Contract } from "ethers";
import { parseEther } from "ethers/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { useBalance, useSigner } from "wagmi";

import managerAbi from "../abis/FNFTManager.json";

export default function Redeem() {
  const { data: signer } = useSigner();
  const [tokenAmount, setTokenAmount] = useState(BigNumber.from("0"));

  const managerContract = new Contract(
    process.env.NEXT_PUBLIC_CONTRACT_MANAGER_ADDRESS!,
    managerAbi.abi,
    signer!
  );

  async function redeemNFT() {
    const approvalTxn = await managerContract.redeem(
      process.env.NEXT_PUBLIC_CONTRACT_NFT_ADDRESS,
      1,
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
          <p>Redeem your tokens and get your NFT back:</p>
          <input
            className="p-2 mt-3"
            type="number"
            placeholder="token amount"
            onChange={(e) => setTokenAmount(parseEther(e.target.value))}
          ></input>
          <button
            className="p-3 mt-3 rounded-xl text-white bg-yellow-500 hover:bg-yellow-600"
            onClick={redeemNFT}
          >
            Redeem Your NFT
          </button>
        </div>
      </div>
    </div>
  );
}

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BigNumber, Contract } from "ethers";
import { parseEther } from "ethers/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { useSigner } from "wagmi";

import managerAbi from "../abis/FNFTManager.json";

export default function Redeem() {
  const { data: signer } = useSigner();
  const [tokenAmount, setTokenAmount] = useState(BigNumber.from("0"));
  const [smartContractAddress, setSmartContractAddres] = useState("");
  const [tokenId, setTokenId] = useState("");

  const managerContract = new Contract(
    process.env.NEXT_PUBLIC_CONTRACT_MANAGER_ADDRESS!,
    managerAbi.abi,
    signer!
  );

  async function redeemNFT() {
    const approvalTxn = await managerContract.redeem(
      smartContractAddress,
      tokenId,
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
        <div className="flex flex-col w-1/2 mx-auto">
          <p>
            If you hold 100% of your tokens, you can redeem get your NFT back:
          </p>
          <input
            className="p-2 mt-3"
            placeholder="NFT smart contract address"
            onChange={(e) => setSmartContractAddres(e.target.value)}
          ></input>
          <input
            className="p-2 mt-3"
            type="number"
            placeholder="NFT token ID"
            onChange={(e) => setTokenId(e.target.value)}
          ></input>
          <input
            className="p-2 mt-3"
            type="number"
            placeholder="Token amount (e.g. 1000)"
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

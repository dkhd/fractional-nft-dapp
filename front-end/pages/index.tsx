import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BigNumber, Contract } from "ethers";
import Link from "next/link";
import { useAccount, useSigner } from "wagmi";
import { parseEther } from "ethers/lib/utils";

import nftAbi from "../abis/NFT.json";
import managerAbi from "../abis/FNFTManager.json";

export default function Home() {
  const [tokenAmount, setTokenAmount] = useState(BigNumber.from("0"));
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [smartContractAddress, setSmartContractAddres] = useState("");
  const [tokenId, setTokenId] = useState("");

  const { data: signer } = useSigner();
  const { isConnected } = useAccount();

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
    const approvalTxn = await nftContract.setApprovalForAll(
      process.env.NEXT_PUBLIC_CONTRACT_MANAGER_ADDRESS!,
      true
    );
    await approvalTxn.wait();
  }

  async function fractionalizeNFT(address: string, tokenId: string) {
    const approvalTxn = await managerContract.fractionalize(
      address,
      tokenId,
      tokenAmount
    );
    await approvalTxn.wait();
  }

  async function fractionalizeBtnHandler() {
    await requestApproval();
    await fractionalizeNFT(smartContractAddress, tokenId);
  }

  useEffect(() => {
    setIsWalletConnected(isConnected);
  }, [isConnected, signer]);

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
        <div className="flex flex-col w-full mx-auto">
          {!isWalletConnected ? (
            <div>
              <p>Please connect your wallet</p>
            </div>
          ) : (
            <div className="flex flex-col mx-auto w-1/2">
              <p className="text-center font-bold text-xl">
                Fill the form below to fractionalize your NFT
              </p>
              <input
                className="p-2 mt-5"
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
                onClick={fractionalizeBtnHandler}
              >
                Fractionalize
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

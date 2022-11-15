import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BigNumber, Contract } from "ethers";
import Link from "next/link";
import { useAccount, useSigner } from "wagmi";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { parseEther } from "ethers/lib/utils";

import nftAbi from "../abis/NFT.json";
import managerAbi from "../abis/FNFTManager.json";

export default function Home() {
  const [tokenAmount, setTokenAmount] = useState(BigNumber.from("0"));
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [nftNumber, setNftNumber] = useState(0);

  const { data: signer } = useSigner();
  const { address, isConnected } = useAccount();

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
      process.env.NEXT_PUBLIC_CONTRACT_MANAGER_ADDRESS,
      true
    );
    await approvalTxn.wait();
  }

  async function fractionalizeNFT(tokenId: number) {
    const approvalTxn = await managerContract.fractionalize(
      process.env.NEXT_PUBLIC_CONTRACT_NFT_ADDRESS,
      tokenId + 1,
      tokenAmount
    );
    await approvalTxn.wait();
  }

  async function getNFTBalance() {
    if (address && signer) {
      const balance = await nftContract.balanceOf(address);
      setNftNumber(Number(balance._hex));
    }
  }

  useEffect(() => {
    setIsWalletConnected(isConnected);

    if (isConnected) getNFTBalance();
  }, [isConnected, signer]);

  function nftCardList() {
    const item: any = [];
    if (nftNumber > 0) {
      for (let i = 0; i < nftNumber; i++) {
        item.push(
          <div
            key={i}
            className="max-w-sm rounded overflow-hidden shadow-lg bg-white"
          >
            <img
              className="w-full"
              src="https://via.placeholder.com/200?text=?"
              alt="NFT dummy image"
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">Your #{i + 1} NFT</div>
              <p className="text-gray-700 text-base">
                Fractional NFT #{i + 1} - minted when deploying your smart
                contract.
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <Popup
                trigger={
                  <button
                    className="w-full p-3 my-3 rounded-xl text-white bg-yellow-500 hover:bg-yellow-600"
                    onClick={requestApproval}
                  >
                    Fractionalize
                  </button>
                }
                position="right center"
                modal
              >
                <div className="flex flex-col p-10">
                  <p className="text-center font-bold text-lg">Step 1:</p>
                  <p className="text-center px-10">
                    To enable fractionalization, we need to request approval for
                    the NFT Manager contract to transfer your NFT:
                  </p>
                  <div className="mx-auto">
                    <button
                      className="p-3 my-3 rounded-xl text-white bg-yellow-500 hover:bg-yellow-600"
                      onClick={requestApproval}
                    >
                      Request Approval
                    </button>
                  </div>
                  <hr className="my-10" />
                  <p className="text-center font-bold text-lg">Step 2:</p>
                  <p className="text-center px-10">
                    Fractionalize your NFT into any ERC-20 tokens you want:
                  </p>
                  <div className="mx-auto w-1/2">
                    <input
                      className="p-2 mt-3 border border-black rounded-xl w-full"
                      type="number"
                      placeholder="Token amount (e.g. 1000)"
                      onChange={(e) =>
                        setTokenAmount(parseEther(e.target.value))
                      }
                    ></input>
                  </div>
                  <div className="mx-auto">
                    <button
                      className="p-3 mt-3 rounded-xl text-white bg-yellow-500 hover:bg-yellow-600"
                      onClick={() => fractionalizeNFT(i)}
                    >
                      Fractionalize NFT
                    </button>
                  </div>
                  <hr className="my-10" />
                  <p className="text-center font-bold text-lg">Step 3:</p>
                  <p className="text-center px-10">
                    Sell your tokens. You can use QuickSwap for selling your
                    ERC-20 tokens.
                  </p>
                  <div className="mx-auto">
                    <a
                      href="https://quickswap.exchange/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <button className="p-3 mt-3 rounded-xl text-white bg-yellow-500 hover:bg-yellow-600">
                        Open QuickSwap
                      </button>
                    </a>
                  </div>
                </div>
              </Popup>
            </div>
          </div>
        );
      }
    } else {
      return <p className="text-center">You do not have any NFT</p>;
    }
    return <div>{item}</div>;
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
        <div className="flex flex-col w-full mx-auto">
          {!isWalletConnected ? (
            <div>
              <p>Please connect your wallet</p>
            </div>
          ) : (
            <div>
              <p className="text-center font-bold text-xl mb-20">
                Your NFT Collections:
              </p>
              <div>{nftCardList()}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

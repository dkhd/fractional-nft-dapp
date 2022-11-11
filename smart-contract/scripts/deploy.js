const { ethers } = require("hardhat");

async function main() {
  const NFTFactory = await ethers.getContractFactory("NFT");
  const FNFTManagerFactory = await ethers.getContractFactory("FNFTManager");

  const nftContract = await NFTFactory.deploy();
  await nftContract.deployed();

  fNftManagerContract = await FNFTManagerFactory.deploy();
  await fNftManagerContract.deployed();

  console.log("NFT contract deployed to: ", nftContract.address);
  console.log(
    "FNFTManager contract deployed to: ",
    fNftManagerContract.address
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

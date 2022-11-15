// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./FractionalNFT.sol";

contract FNFTManager {
    
    mapping(address => mapping (uint => FractionalNFT)) public fractionalContracts;
    uint256 totalTokens;

    function fractionalize(address nftTokenAddress, uint256 tokenId, uint256 amountOfTokens) public {
        totalTokens = amountOfTokens;
        FractionalNFT newContract = new FractionalNFT(msg.sender, amountOfTokens, nftTokenAddress);
        ERC721(nftTokenAddress).safeTransferFrom(msg.sender, address(newContract), tokenId);
        fractionalContracts[nftTokenAddress][tokenId] = newContract;
    }

    function redeem(address nftTokenAddress, uint256 tokenId, uint256 amount) public {
        FractionalNFT subContract = fractionalContracts[nftTokenAddress][tokenId];
        bool status = subContract.redeem(msg.sender, amount, tokenId);
        require(status, "Failed to redeem"); 
        subContract.destroy();
        delete fractionalContracts[nftTokenAddress][tokenId];
    }
}
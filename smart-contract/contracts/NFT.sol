// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721 {
    constructor(uint256 tokenId) ERC721("LW3 NFT", "LW3") {
        _safeMint(msg.sender, tokenId);
    }
}
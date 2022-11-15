// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract FractionalNFT is ERC20, ERC721Holder, Ownable {

	uint256 totalTokens;
    ERC721 nft;

	constructor(address recipient, uint256 amountOfTokens, address nftContractAddress) ERC20("NFToken", "TKN") {
        nft = ERC721(nftContractAddress);
        totalTokens = amountOfTokens;
	    _mint(recipient, amountOfTokens);
    }

	function redeem(address ownerAddress, uint256 amount, uint256 tokenId) public onlyOwner returns(bool) {
        require((balanceOf(ownerAddress) == totalTokens), "Balance is not equal");
        _transfer(ownerAddress, address(this), amount);
        nft.transferFrom(address(this), ownerAddress, tokenId);
        return true;
    }

    function destroy() public onlyOwner {
        selfdestruct(payable(address(this)));
    }

}

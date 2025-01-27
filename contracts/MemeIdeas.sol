// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract MemeIdeas {
    string public publicMeme = "Open door with a neon sign: 'Come on in, everyone!'";
    string private privateMeme = "Heavily guarded vault door: 'No Peeking! Private means PRIVATE!'";
    string internal internalMeme = "Family dinner table with a bouncer: 'Internal Functions Only.'";
    string externalMeme = "Phone ringing outside a house: 'External Calls Only.'";

   
    function getPrivateMeme() public view returns (string memory) {
        return privateMeme;
    }

    function getInternalMeme() external view returns (string memory) {
        return internalMeme;
    }

    function getExternalMeme() external view returns (string memory) {
        return externalMeme;
    }
}

#Solidity Visibility Explorer

Overview
This project demonstrates the different visibility types in Solidity smart contracts: public, private, internal, and external. The frontend is built using React and Ethers.js to interact with the deployed smart contract and display data for all four visibility types.
Smart Contract Explanation
In Solidity, functions and variables have visibility modifiers that control their accessibility:
Public: Accessible from anywhere, including externally via Web3 calls.
Private: Only accessible within the contract.
Internal: Accessible within the contract and derived contracts but not externally.
External: Only accessible via external calls, not within the same contract.
To demonstrate these types in the frontend, the private and internal variables/functions are exposed using public functions.
Contract Logic
--bash
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract MemeIdeas {
    string public publicMeme = "Open door with a neon sign: 'Come on in, everyone!'";
    string private privateMeme = "Heavily guarded vault door: 'No Peeking! Private means PRIVATE!'";
    string internal internalMeme = "Family dinner table with a bouncer: 'Internal Functions Only.'";
    string external externalMeme = "Phone ringing outside a house: 'External Calls Only.'";

    // Public getter for the private variable
    function getPrivateMeme() public view returns (string memory) {
        return privateMeme;
    }

    // Public getter for the internal variable
    function getInternalMeme() public view returns (string memory) {
        return internalMeme;
    }

    // External function remains as is
    function getExternalMeme() external view returns (string memory) {
        return externalMeme;
    }
}

Why Use Public and External Functions?
To display all four types of visibility in the frontend:
Public and External: These can be directly accessed via Ethers.js in the frontend.
Private and Internal: These are not directly accessible from the frontend. We used public functions (getPrivateMeme and getInternalMeme) to expose their values for demonstration purposes.
This approach ensures that the private and internal variables remain true to their visibility definitions while allowing their outputs to be displayed in the frontend.
Frontend Setup
The frontend is built with React and uses Ethers.js to interact with the smart contract. It connects to the blockchain, fetches data for all visibility types, and displays the results.
Key Features
Wallet Connection: Uses MetaMask to connect to the user's wallet.
Dynamic Data Fetching: Fetches visibility-related outputs from the contract and displays them in a user-friendly interface.
Error Handling: Displays appropriate messages for errors such as failed wallet connections.
Code
Below is the React frontend code:
"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const contractABI = [
  {
    inputs: [],
    name: "publicMeme",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPrivateMeme",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getInternalMeme",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getExternalMeme",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
];

export default function Home() {
  const [memes, setMemes] = useState({
    public: "",
    private: "",
    internal: "",
    external: "",
  });
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to connect 🦊");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      setConnected(true);
      fetchMemes();
    } catch (err) {
      console.error("Wallet connection failed", err);
    }
  };

  const fetchMemes = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      const publicMeme = await contract.publicMeme();
      const privateMeme = await contract.getPrivateMeme();
      const internalMeme = await contract.getInternalMeme();
      const externalMeme = await contract.getExternalMeme();

      setMemes({
        public: publicMeme,
        private: privateMeme,
        internal: internalMeme,
        external: externalMeme,
      });
    } catch (error) {
      console.error("Error fetching memes", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-cyan-400 mb-4">Solidity Visibility Explorer</h1>

      <button
        onClick={connectWallet}
        className={`px-6 py-2 rounded-lg mb-4 ${
          connected ? "bg-green-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        } transition-colors`}
        disabled={connected}
      >
        {connected ? `Connected: ${account?.slice(0, 6)}...` : "Connect Wallet"}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div className="p-6 rounded-lg shadow-lg bg-cyan-600 bg-opacity-80">
          <h2 className="text-2xl font-semibold mb-2">Public</h2>
          <p className="text-lg">{memes.public || "Click Connect to fetch"}</p>
        </div>
        <div className="p-6 rounded-lg shadow-lg bg-pink-600 bg-opacity-80">
          <h2 className="text-2xl font-semibold mb-2">Private</h2>
          <p className="text-lg">{memes.private || "Click Connect to fetch"}</p>
        </div>
        <div className="p-6 rounded-lg shadow-lg bg-purple-600 bg-opacity-80">
          <h2 className="text-2xl font-semibold mb-2">Internal</h2>
          <p className="text-lg">{memes.internal || "Click Connect to fetch"}</p>
        </div>
        <div className="p-6 rounded-lg shadow-lg bg-yellow-600 bg-opacity-80">
          <h2 className="text-2xl font-semibold mb-2">External</h2>
          <p className="text-lg">{memes.external || "Click Connect to fetch"}</p>
        </div>
      </div>
    </div>
  );
}

How to Run the Project
Prerequisites
Node.js and npm installed
MetaMask browser extension
Hardhat development environment
Steps
Clone the Repository:

 git clone <repo-url>
cd <repo-directory>


Install Dependencies:

 npm install


Deploy the Smart Contract:

 npx hardhat run scripts/deploy.js --network localhost


Set Environment Variables: Create a .env file in the frontend directory and set the deployed contract address:

 NEXT_PUBLIC_CONTRACT_ADDRESS=<deployed_contract_address>


Run the Frontend:

 npm run dev


Access the App: Open http://localhost:3000 in your browser and connect your MetaMask wallet to interact with the contract.



This project highlights Solidity's visibility concepts while demonstrating how to interact with smart contracts in a frontend application. Let me know if you need additional support!


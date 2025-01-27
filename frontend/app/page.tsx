"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
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

const MemeCard = ({ title, content, color, onClick, isLoading, isVisible }) => (
  <div
    onClick={onClick}
    className={`p-6 rounded-lg shadow-lg ${color} bg-opacity-80 cursor-pointer hover:scale-105 transition`}
  >
    <h2 className="text-2xl font-semibold mb-2">{title}</h2>
    {isLoading ? (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    ) : (
      <div className="min-h-[60px]">
        {isVisible ? (
          <p className={`text-lg animate-fadeIn ${
            content.startsWith("Error:") ? "text-red-400" : ""
          }`}>
            {content}
          </p>
        ) : (
          <p className="text-gray-300 text-lg">Click to reveal</p>
        )}
      </div>
    )}
  </div>
);

export default function Home() {
  const [memes, setMemes] = useState({
    public: { content: "", visible: false, loaded: false },
    private: { content: "", visible: false, loaded: false },
    internal: { content: "", visible: false, loaded: false },
    external: { content: "", visible: false, loaded: false }
  });
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState({
    public: false,
    private: false,
    internal: false,
    external: false
  });

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("Please install MetaMask to connect 🦊");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ 
        method: "eth_requestAccounts" 
      });
      setAccount(accounts[0]);
      setConnected(true);
      setError("");
    } catch (err) {
      setError(`Connection failed: ${err.message || "User rejected request"}`);
    }
  };

  const handleMemeToggle = async (memeType) => {
    if (!connected) {
      setError("Please connect wallet first 🔗");
      return;
    }

    if (memes[memeType].loaded) {
      setMemes(prev => ({
        ...prev,
        [memeType]: { ...prev[memeType], visible: !prev[memeType].visible }
      }));
      return;
    }

    setLoading(prev => ({ ...prev, [memeType]: true }));
    setError("");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      
      const methodMap = {
        public: "publicMeme",
        private: "getPrivateMeme",
        internal: "getInternalMeme",
        external: "getExternalMeme"
      };

      const memeValue = await contract[methodMap[memeType]]();
      
      setMemes(prev => ({
        ...prev,
        [memeType]: {
          content: memeValue,
          visible: true,
          loaded: true
        }
      }));
    } catch (err) {
      let errorMessage = "Unknown error";
      if (err.message.includes("revert")) {
        errorMessage = `Inaccessible: ${memeType} function`;
      } else if (err.message.includes("missing method")) {
        errorMessage = "Function doesn't exist in contract";
      } else {
        errorMessage = err.shortMessage || err.message;
      }

      setMemes(prev => ({
        ...prev,
        [memeType]: {
          content: `Error: ${errorMessage}`,
          visible: true,
          loaded: true
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [memeType]: false }));
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum?.isConnected()) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setConnected(true);
          }
        } catch (err) {
          console.error("Connection check failed:", err);
        }
      }
    };
    
    checkConnection();
    window.ethereum?.on("accountsChanged", (accounts) => {
      setConnected(accounts.length > 0);
      setAccount(accounts[0] || null);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-cyan-400 mb-4">
        Solidity Visibility Explorer
      </h1>

      <button
        onClick={connectWallet}
        className={`px-6 py-2 rounded-lg mb-4 ${
          connected 
            ? "bg-green-500 cursor-not-allowed" 
            : "bg-blue-500 hover:bg-blue-600"
        } transition-colors`}
        disabled={connected}
      >
        {connected ? `Connected: ${account?.slice(0, 6)}...` : "Connect Wallet"}
      </button>

      {error && (
        <div className="bg-red-800 p-3 rounded-lg mb-4 max-w-md text-center">
          ⚠️ {error}
        </div>
      )}

      <p className="text-sm text-gray-400 mb-8">
        Contract Address: {contractAddress}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <MemeCard
          title="Public Meme"
          color="bg-cyan-600"
          content={memes.public.content}
          isVisible={memes.public.visible}
          isLoading={loading.public}
          onClick={() => handleMemeToggle("public")}
        />
        <MemeCard
          title="Private Meme"
          color="bg-pink-600"
          content={memes.private.content}
          isVisible={memes.private.visible}
          isLoading={loading.private}
          onClick={() => handleMemeToggle("private")}
        />
        <MemeCard
          title="Internal Meme"
          color="bg-purple-600"
          content={memes.internal.content}
          isVisible={memes.internal.visible}
          isLoading={loading.internal}
          onClick={() => handleMemeToggle("internal")}
        />
        <MemeCard
          title="External Meme"
          color="bg-yellow-600"
          content={memes.external.content}
          isVisible={memes.external.visible}
          isLoading={loading.external}
          onClick={() => handleMemeToggle("external")}
        />
      </div>
    </div>
  );
}
"use client";
import { useEthersSigner } from "@/components/EthersSigner";
import { Button } from "@material-tailwind/react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { ethers } from "ethers";
import SafeApiKit from "@safe-global/api-kit";
import axios from "axios";
import TLBankABI from "@/components/abi";
import { useEthersProvider } from "@/components/EthersProvider";

const SAFE_TRANSACTION_API = {
  mainnet: "https://safe-transaction-mainnet.safe.global",
};

const tlBankAddress = {
  mainnet: "0xeaEAb9f1B25fa00FC01a3fcE521b47E88527Aa02",
};

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const provider = useEthersProvider();
  const signer = useEthersSigner();

  const getAllSafes = async (address) => {
    const safes = await axios.get(
      `${SAFE_TRANSACTION_API.mainnet}/api/v1/owners/${address}/safes/`
    );

    console.log(safes.data.safes);
  };

  const createTLBank = async (recipient, amount, unlockDate) => {
    const TLBank = new ethers.Contract(
      tlBankAddress.mainnet,
      TLBankABI,
      provider
    );

    const unsignedTx = await TLBank.populateTransaction.createNFT(
      recipient,
      amount,
      unlockDate
    );

    const tx = {
      to: tlBankAddress.mainnet,
      value: 0,
      data: unsignedTx.data,
      gasLimit: 1000000,
    };

    const txHash = await signer.sendTransaction(tx);
    console.log(txHash);
  };

  const lockAndLoadTLBank = async (id, amount, relockDate) => {
    const TLBank = new ethers.Contract(
      tlBankAddress.mainnet,
      TLBankABI,
      provider
    );

    const unsignedTx = await TLBank.populateTransaction.locknLoadNFT(
      id,
      amount,
      relockDate
    );

    const tx = {
      to: tlBankAddress.mainnet,
      value: 0,
      data: unsignedTx.data,
      gasLimit: 1000000,
    };

    const txHash = await signer.sendTransaction(tx);
    console.log(txHash);
  };

  const redeemTLBank = async (id) => {
    const TLBank = new ethers.Contract(
      tlBankAddress.mainnet,
      TLBankABI,
      provider
    );

    const unsignedTx = await TLBank.populateTransaction.redeemNFT(id);

    const tx = {
      to: tlBankAddress.mainnet,
      value: 0,
      data: unsignedTx.data,
      gasLimit: 1000000,
    };

    const txHash = await signer.sendTransaction(tx);
    console.log(txHash);
  };

  const fetchAllTLBanks = async () => {
    const headers = {
      "x-api-key": "0fcf4a578ff740ca9cc84f8d0df462ce",
    };

    const response = await axios.get(
      "https://api.opensea.io/api/v2/collection/timelockedbank/nfts",
      { headers }
    );
    console.log(response.data);
  };

  return (
    <div className="flex min-h-screen flex-col items-center gap-5 p-10 ">
      <Button color="blue" onClick={connect}>
        Connect
      </Button>
      {isConnected && <div>{address}</div>}
      {isConnected && (
        <Button color="red" onClick={disconnect}>
          Disconnect
        </Button>
      )}
      {isConnected && (
        <>
          <Button color="blue" onClick={() => getAllSafes(address)}>
            Get All Safes
          </Button>
          <Button
            color="blue"
            onClick={() => createTLBank(address, 1, 1000000000)}
          >
            Create TLBank
          </Button>
          <Button
            color="blue"
            onClick={() => lockAndLoadTLBank(1, 1, 1000000000)}
          >
            Lock and Load TLBank
          </Button>
          <Button color="blue" onClick={() => redeemTLBank(1)}>
            Redeem TLBank
          </Button>
        </>
      )}
      <Button color="blue" onClick={() => fetchAllTLBanks()}>
        Fetch All TLBanks
      </Button>
    </div>
  );
}

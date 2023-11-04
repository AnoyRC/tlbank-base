"use client";
import { useEthersSigner } from "@/components/EthersSigner";
import { Button } from "@material-tailwind/react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { ethers } from "ethers";
import SafeApiKit from "@safe-global/api-kit";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const signer = useEthersSigner();

  const getAllSafes = async (address) => {
    const ethAdapter = {
      ethers,
      signerOrProvider: signer,
    };

    const safeService = new SafeApiKit({
      txServiceUrl: "https://safe-transaction-goerli.safe.global",
      ethAdapter,
    });

    const safes = await safeService.getSafesByOwner(address);
    console.log(safes);
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
        <Button color="blue" onClick={() => getAllSafes(address)}>
          Get All Safes
        </Button>
      )}
    </div>
  );
}

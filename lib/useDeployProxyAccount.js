import { SequencerProvider } from "starknet";
import { useEffect, useState } from "react";

const timer = 5000;

export const useDeployProxyAccount = (
  contract,
  accountClassHash,
  publicKey,
  pluginClassHash
) => {
  const deployContract = async () => {
    const calldata = [accountClassHash, publicKey];
    if (pluginClassHash) {
      calldata.push(pluginClassHash);
    }
    const provider = new SequencerProvider();
    return await provider.deployContract({
      contract: contract(),
      constructorCalldata: calldata,
      addressSalt: publicKey,
    });
  };

  const [waitCounter, setWaitCounter] = useState(0);
  const [deployedContractTransaction, setDeployedContractTransaction] =
    useState("");
  const [deployedContractAddress, setDeployedContractAddress] = useState("");
  const [deployedContractStatus, setDeployedContractStatus] =
    useState("UNKNOWN");

  useEffect(() => {
    let timeout = setTimeout(async () => {
      if (!deployedContractTransaction) {
        console.log("should return deployedContractTransaction");
        return;
      }
      const provider = new SequencerProvider();
      const receipt = await provider.getTransactionReceipt(
        deployedContractTransaction
      );
      setDeployedContractStatus(receipt.status);
      if (!["ACCEPTED_ON_L2", "ACCEPTED_ON_L1"].includes(receipt.status)) {
        setWaitCounter((counter) => counter + 1);
      }
      return () => {
        clearTimeout(timeout);
      };
    }, timer);
  }, [waitCounter, deployedContractTransaction]);

  const rundeploy = async () => {
    if (!accountClassHash || !publicKey || !pluginClassHash) {
      return console.log("missing data");
    }
    const response = await deployContract();
    setDeployedContractAddress(response.contract_address);
    setDeployedContractTransaction(response.transaction_hash);
    return response;
  };

  return [
    deployedContractAddress,
    deployedContractStatus,
    deployedContractTransaction,
    rundeploy,
  ];
};

export default useDeployProxyAccount;

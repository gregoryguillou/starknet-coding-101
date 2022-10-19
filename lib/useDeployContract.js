import { SequencerProvider } from "starknet";
import { useEffect, useState } from "react";

const timer = 5000;

export const useDeployContract = (contract, addressSalt = "0x0") => {
  const deployContract = async () => {
    const calldata = [];
    const provider = new SequencerProvider();
    return await provider.deployContract({
      addressSalt,
      contract: contract(),
      constructorCalldata: calldata,
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
    const res = await deployContract();
    setDeployedContractAddress(res.contract_address);
    setDeployedContractTransaction(res.transaction_hash);
    return res;
  };

  return [
    deployedContractAddress,
    deployedContractStatus,
    deployedContractTransaction,
    rundeploy,
  ];
};

export default useDeployContract;

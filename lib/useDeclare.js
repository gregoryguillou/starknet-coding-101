import { SequencerProvider } from "starknet";
import { useEffect, useState } from "react";

const timer = 5000;

export const useDeclare = (contract) => {
  const declareContract = async () => {
    const provider = new SequencerProvider();
    return await provider.declareContract({ contract: contract() });
  };

  const [waitCounter, setWaitCounter] = useState(0);
  const [declaredContractTransaction, setDeclaredContractTransaction] =
    useState("");
  const [declaredContractClassHash, setDeclaredContractClassHash] =
    useState("");
  const [declaredContractStatus, setDeclaredContractStatus] =
    useState("UNKNOWN");

  useEffect(() => {
    let timeout = setTimeout(async () => {
      if (!declaredContractTransaction) {
        console.log("should return declaredContractTransaction");
        return;
      }
      const provider = new SequencerProvider();
      const receipt = await provider.getTransactionReceipt(
        declaredContractTransaction
      );
      setDeclaredContractStatus(receipt.status);
      if (!["ACCEPTED_ON_L2", "ACCEPTED_ON_L1"].includes(receipt.status)) {
        setWaitCounter((counter) => counter + 1);
      }
      return () => {
        clearTimeout(timeout);
      };
    }, timer);
  }, [waitCounter, declaredContractTransaction]);

  const runDeclare = async () => {
    const response = await declareContract();
    setDeclaredContractTransaction(response.transaction_hash);
    setDeclaredContractClassHash(response.class_hash);
    return response;
  };

  return [
    declaredContractClassHash,
    declaredContractStatus,
    declaredContractTransaction,
    runDeclare,
  ];
};

export default useDeclare;

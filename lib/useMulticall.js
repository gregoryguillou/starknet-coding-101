import { useEffect, useState } from "react";
import { toBN } from "starknet/utils/number";

const timer = 5000;

export const useMulticall = (account, calls) => {
  const startExecute = async () => {
    const sanitizedCalls = calls.map((call) => {
      const calldata = call.calldata.map((param) => {
        if (param.slice(0, 2) === "0x") {
          return toBN(param.slice(2), hex).toString(10);
        }
        return param;
      });
      return {
        contractAddress: call.contractAddress,
        entrypoint: call.entrypoint,
        calldata,
      };
    });
    return await account.execute(sanitizedCalls);
  };

  const [waitCounter, setWaitCounter] = useState(0);
  const [executeTransaction, setExecuteTransaction] = useState("");
  const [executeTransactionStatus, setExecuteTransactionStatus] =
    useState("UNKNOWN");

  useEffect(() => {
    let timeout = setTimeout(async () => {
      if (!executeTransaction) {
        console.log("should return executeTransaction");
        return;
      }
      const receipt = await account.provider.getTransactionReceipt(
        executeTransaction
      );
      setExecuteTransactionStatus(receipt.status);
      if (
        !["REJECTED", "ACCEPTED_ON_L2", "ACCEPTED_ON_L1"].includes(
          receipt.status
        )
      ) {
        setWaitCounter((counter) => counter + 1);
      }
      return () => {
        clearTimeout(timeout);
      };
    }, timer);
  }, [waitCounter, executeTransaction, account]);

  const execute = async () => {
    try {
      const response = await startExecute();
      setExecuteTransaction(response.transaction_hash);
      return response;
    } catch (e) {
      console.log(e);
      setExecuteTransactionStatus("ERROR");
      return { transaction_hash: "" };
    }
  };

  return [executeTransactionStatus, executeTransaction, execute];
};

export default useMulticall;

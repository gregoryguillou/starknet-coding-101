import styled from "styled-components";
import { useEffect, useState } from "react";
import Link from "next/link";
import SessionKey from "components/SessionKey";
import ArgentX from "components/ArgentX";
import Authorize from "components/Authorize";
import IncrementCounter from "components/IncrementCounter";
import { originalIncrementContract } from "lib/constants";

export const DappRequest = () => {
  const [sessionPrivateKey, setSessionPrivateKey] = useState("");
  const [argentXAccount, setArgentXAccount] = useState();
  const [sessionAccount, setSessionAccount] = useState();

  useEffect(() => {
    console.log(sessionAccount);
  }, [sessionAccount]);

  // Since we are using
  const connect = async () => {
    const starknet = window["starknet-argentX"];
    if (!starknet) {
      console.log("argent-x not found");
      return;
    }
    if (starknet?.isConnected) {
      setAccount(starknet?.account);
      setAccountAddress(starknet?.account.address);
    }
    await starknet.enable({ starknetVersion: "v4" });
    if (starknet?.isConnected) {
      setAccount(starknet?.account);
      setAccountAddress(starknet?.account.address);
    }
  };

  return (
    <main>
      <Link href="/">Back</Link>
      <h2>Dapp (all-in-one)</h2>
      <p></p>
      <h3>1. Generates a Private Key</h3>
      <SessionKey
        keyname="GameSessionKey"
        setSessionPrivateKey={setSessionPrivateKey}
      />
      <h3>2. Connect to Argent-X</h3>
      <ArgentX setArgentAccount={setArgentXAccount} />
      <h3>3. Request an Authorization</h3>
      <Authorize
        sessionPrivateKey={sessionPrivateKey}
        argentxAccount={argentXAccount}
        setSessionAccount={setSessionAccount}
      />
      <h3>4. Use the Authorization</h3>
      <IncrementCounter
        account={sessionAccount}
        contractAddress={originalIncrementContract}
      />
      <Link href="/">Back</Link>
    </main>
  );
};

export default DappRequest;

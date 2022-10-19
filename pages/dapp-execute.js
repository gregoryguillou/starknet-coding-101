import styled from "styled-components";
import { useEffect, useState } from "react";
import Link from "next/link";
import useLocalStorage from "lib/useLocalStorage";
import { SequencerProvider, Signer } from "starknet";
import { getKeyPair, getStarkKey } from "starknet/utils/ellipticCurve";
import IncrementCounter from "components/IncrementCounter";
import { SessionAccount } from "@argent/x-sessions";

const Form = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Block = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const ExpandedInput = styled.input`
  width: 100%;
`;

const incrementContractAddress =
  "0x51e94d515df16ecae5be4a377666121494eb54193d854fcf5baba2b0da679c6";

export const DappExecute = () => {
  const [dappPrivateKey] = useLocalStorage("SnapSessionPrivateKey", "");
  const [dappPublicKey, setDappPublicKey] = useState("");
  const [accountAddress, setAccountAddress] = useState("");
  const [account, setAccount] = useState();
  const [signedAuthorization, setSignedAuthorization] = useState({});
  const [incrementValue, setIncrementValue] = useState("unknown");

  useEffect(() => {
    if (!dappPrivateKey || !accountAddress || !signedAuthorization) {
      console.log("could not get account yet");
      return;
    }
    const keyPair = getKeyPair(dappPrivateKey);
    const signer = new Signer(keyPair);
    const { account: _, ...signedSession } = signedAuthorization;
    console.log(JSON.stringify(signedSession));
    const account = new SessionAccount(
      new SequencerProvider(),
      accountAddress,
      signer,
      signedSession
    );
    setAccount(account);
  }, [dappPrivateKey, accountAddress, signedAuthorization]);

  useEffect(() => {
    const dappKeyPair = getKeyPair(dappPrivateKey);
    setDappPublicKey(getStarkKey(dappKeyPair));
  }, [dappPrivateKey]);

  const getSignedAuthorization = async () => {
    try {
      const response = await fetch(
        `https://api.qasar.xyz/authorizations/${dappPublicKey}`
      );
      console.log(response);
      if (response.status !== 200) {
        return;
      }
      const content = await response.json();
      if (!content?.account) {
        return;
      }
      setAccountAddress(content.account);
      setSignedAuthorization(content);
    } catch (e) {
      console.log("could not find Authorization");
    }
  };

  const callGetCounter = async () => {
    const output = await account.callContract({
      contractAddress: incrementContractAddress,
      entrypoint: "get_count",
    });
    if (!output.result || output.result.length === 0) {
      throw new Error("error with get_count");
    }
    setIncrementValue(output.result[0]);
  };

  return (
    <main>
      <Link href="/">Back</Link>
      <h2>Authorized Transactions</h2>
      <p></p>
      <h3>Get Authorization</h3>
      <Form>
        <Block>
          <label>Public Key</label>
          <ExpandedInput type="text" value={dappPublicKey} readOnly />
          <input
            type="button"
            value="Load..."
            onClick={getSignedAuthorization}
          />
        </Block>
        <label>Account</label>
        <input type="text" value={accountAddress} readOnly />
        <label>Authorization</label>
        <textarea
          rows="10"
          value={JSON.stringify(signedAuthorization)}
          readOnly
        />
      </Form>
      <h2>call get_count</h2>
      <Form>
        <label>Contract Address</label>
        <input type="text" value={incrementContractAddress} readOnly />
        <label>Count Value</label>
        <Block>
          <input type="button" value="check" onClick={callGetCounter} />
          <ExpandedInput type="text" value={incrementValue} readOnly />
        </Block>
      </Form>
      <IncrementCounter account={account} />
      <Link href="/">Back</Link>
    </main>
  );
};

export default DappExecute;

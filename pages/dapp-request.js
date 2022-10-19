import styled from "styled-components";
import { useEffect, useState } from "react";
import Link from "next/link";
import useLocalStorage from "lib/useLocalStorage";
import {
  genKeyPair,
  getKeyPair,
  getStarkKey,
} from "starknet/utils/ellipticCurve";

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

export const DappRequest = () => {
  const [sessionPrivateKey, setSessionPrivateKey] = useLocalStorage(
    "SnapSessionPrivateKey",
    "0x1"
  );
  const [dappPublicKey, setDappPublicKey] = useState("0x1");
  const [pinCode, setPinCode] = useState("");

  const handlerFunction = (setPrivateKey) => {
    const handlePrivateKey = (event) => {
      if (event.target.value.startWith("0x")) {
        setPrivateKey(event.target.value);
      }
    };
    return handlePrivateKey;
  };

  const genPrivateKey = (setPrivateKey) => {
    const keypair = genKeyPair();
    const privateKey = `0x${keypair.getPrivate().toString(16)}`;
    setPrivateKey(privateKey);
  };

  const copyPinCode = async () => {
    try {
      await navigator.clipboard.writeText(pinCode);
    } catch (e) {
      console.log("cannot copy code to clipboard");
    }
  };

  useEffect(() => {
    const keypair = getKeyPair(sessionPrivateKey);
    const publicKey = getStarkKey(keypair);
    setDappPublicKey(publicKey);
  }, [sessionPrivateKey]);

  const requestAuthorization = async () => {
    console.log(dappPublicKey, "0xdeadbeef");
    const response = await fetch("https://api.qasar.xyz/requests", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: dappPublicKey,
        dappTokenID: "0xdeadbeef",
      }),
    });
    const content = await response.json();
    setPinCode(content.requestID);
  };

  return (
    <main>
      <Link href="/">Back</Link>
      <h2>Authorization Request</h2>
      <p></p>
      <h3>Dapp Keys</h3>
      <Form>
        <label>Private Key</label>
        <Block>
          <ExpandedInput
            type="text"
            value={sessionPrivateKey}
            onChange={handlerFunction(setSessionPrivateKey)}
          />
          <input
            type="button"
            value="random"
            onClick={() => {
              genPrivateKey(setSessionPrivateKey);
            }}
          />
        </Block>
        <label>Public Key</label>
        <input type="text" value={dappPublicKey} disabled />
      </Form>
      <h3>Authorization Request</h3>
      <div>
        <input type="text" value={pinCode} readOnly />
        <input type="button" value="Request" onClick={requestAuthorization} />
        <input type="button" value="Copy" onClick={copyPinCode} />
      </div>
      <Link href="/">Back</Link>
    </main>
  );
};

export default DappRequest;

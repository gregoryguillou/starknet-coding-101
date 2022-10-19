import styled from "styled-components";
import { useEffect, useState } from "react";
import { createSession, SessionAccount } from "@argent/x-sessions";
import { originalIncrementContract } from "lib/constants";
import { SequencerProvider, Signer } from "starknet";
import { getKeyPair, getStarkKey } from "starknet/utils/ellipticCurve";

const Form = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Authorize = ({
  sessionPrivateKey,
  argentxAccount,
  setSessionAccount,
}) => {
  const [sessionPublicKey, setSessionPublicKey] = useState();
  const [auth, setAuth] = useState();

  useEffect(() => {
    if (!sessionPrivateKey) {
      console.log("could not find private key");
      return;
    }
    const keyPair = getKeyPair(sessionPrivateKey);
    const publicKey = getStarkKey(keyPair);
    setSessionPublicKey(publicKey);
  }, [sessionPrivateKey]);

  useEffect(() => {
    if (!argentxAccount?.address || !auth || !sessionPrivateKey) {
      console.log("could not connect to session key");
      return;
    }
    const keyPair = getKeyPair(sessionPrivateKey);
    const signer = new Signer(keyPair);
    const s = new SessionAccount(
      new SequencerProvider(),
      argentxAccount.address,
      signer,
      auth
    );
    setSessionAccount(s);
  }, [auth, argentxAccount, sessionPrivateKey]);

  const policies = [
    {
      contractAddress: originalIncrementContract,
      selector: "increment",
    },
  ];

  const authorize = async () => {
    if (!sessionPublicKey || !argentxAccount) {
      console.log("missing public key or account");
    }
    const requestSession = {
      key: sessionPublicKey,
      expires: Math.floor((Date.now() + 1000 * 60 * 60 * 24) / 1000), // 1 day in seconds
      policies: policies,
    };
    const authorize = await createSession(requestSession, argentxAccount);
    setAuth(authorize);
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      console.log("cannot copy to clipboard");
    }
  };

  return (
    <Form>
      <input type="button" value="Sign" onClick={authorize} />
      <label>Signed Authorization</label>
      <textarea rows="10" value={auth ? JSON.stringify(auth) : ""} readOnly />
      <input
        type="button"
        value="copy manifest"
        onClick={() => {
          copy(auth);
        }}
      />
    </Form>
  );
};

export default Authorize;

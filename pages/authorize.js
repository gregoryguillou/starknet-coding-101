import styled from "styled-components";
import { useState } from "react";
import Link from "next/link";
import useLocalStorage from "lib/useLocalStorage";
import { createSession } from "@argent/x-sessions";
import { Account, SequencerProvider } from "starknet";
import { getKeyPair } from "starknet/utils/ellipticCurve";
import InputTextWithCopy from "components/InputTextWithCopy";
import { originalIncrementContract } from "lib/constants";

const NavLink = styled(Link)``;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const PinCode = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

export const Authorize = () => {
  const [pinCode, setPinCode] = useState("");
  const [dappTokenID, setDappTokenID] = useState("");
  const [dappPublicKey, setDappPublicKey] = useState("");
  const [walletPrivateKey] = useLocalStorage("SnapWalletPrivateKey", "");
  const [accountAddress] = useLocalStorage("SnapWalletAccountAddress", "0x1");
  const [signedAuthorization, setSignedAuthorization] = useState("");
  const [success, setSuccess] = useState("");

  const getAuthorizationRequest = async () => {
    const response = await fetch(`https://api.qasar.xyz/requests/${pinCode}`);
    const content = await response.json();
    setDappTokenID(content.dappTokenID);
    setDappPublicKey(content.key);
  };

  const policies = [
    {
      contractAddress: originalIncrementContract,
      selector: "increment",
    },
    {
      contractAddress: originalIncrementContract,
      selector: "increment_uint",
    },
  ];

  const sign = async () => {
    const requestSession = {
      key: dappPublicKey,
      expires: Math.floor((Date.now() + 1000 * 60 * 60 * 24) / 1000), // 1 day in seconds
      policies: policies,
    };
    const account = new Account(
      new SequencerProvider(),
      accountAddress,
      getKeyPair(walletPrivateKey)
    );
    const auth = await createSession(requestSession, account);
    setSignedAuthorization(auth);
  };

  const createAuthorization = async () => {
    try {
      setSuccess("uploading...");
      await fetch("https://api.qasar.xyz/authorizations", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: accountAddress,
          ...signedAuthorization,
        }),
      });
      setSuccess("succeeded");
    } catch (e) {
      setSuccess("failed");
    }
  };

  return (
    <main>
      <Link href="/">Back</Link>
      <h2>Sign Authorization</h2>
      <p>
        this page show how you can get the request and provide the associated
        authorization.
      </p>
      <h3>Get Dapp Request</h3>
      <Form>
        <PinCode>
          <label>Pin Code</label>
          <input
            type="text"
            onChange={(event) => {
              setPinCode(event.target.value);
            }}
          />
          <input
            type="button"
            value="Get Request"
            onClick={() => {
              getAuthorizationRequest();
            }}
          />
        </PinCode>
        <label>Dapp Public Key</label>
        <InputTextWithCopy value={dappPublicKey} readOnly />
        <label>Dapp Token ID</label>
        <InputTextWithCopy value={dappTokenID} readOnly />
      </Form>
      <h3>Authorize</h3>
      <Form>
        <input type="button" value="Sign" onClick={sign} />
        <label>Signed Authorization</label>
        <textarea
          rows="10"
          value={JSON.stringify(signedAuthorization)}
          readOnly
        />
      </Form>
      <h3>Forward Authorization</h3>
      <Form>
        <input
          type="button"
          value="Forward Signed"
          onClick={createAuthorization}
        />
        <p>{success}</p>
      </Form>
      <NavLink href="/">Back</NavLink>
    </main>
  );
};

export default Authorize;

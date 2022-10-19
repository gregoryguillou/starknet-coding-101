import styled from "styled-components";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createSession } from "@argent/x-sessions";
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
  const [signedAuthorization, setSignedAuthorization] = useState("");
  const [success, setSuccess] = useState("");
  const [account, setAccount] = useState("");
  const [accountAddress, setAccountAddress] = useState("");

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

  useEffect(() => {
    setAccountAddress(account?.address);
  }, [account]);

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
  ];

  const sign = async () => {
    const requestSession = {
      key: dappPublicKey,
      expires: Math.floor((Date.now() + 1000 * 60 * 60 * 24) / 1000), // 1 day in seconds
      policies: policies,
    };
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
      <h2>Connect to Argent-X</h2>
      <Form>
        <input type="button" value="Connect..." onClick={connect} />
        <InputTextWithCopy type="text" value={accountAddress} />
      </Form>
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

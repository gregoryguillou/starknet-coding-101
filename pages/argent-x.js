import styled from "styled-components";
import { useState } from "react";
import Link from "next/link";
import InputTextWithCopy from "components/InputTextWithCopy";
import IncrementMulticall from "components/IncrementMulticall";

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

export const ArgentX = () => {
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

  return (
    <main>
      <Link href="/">Back</Link>
      <h2>Connect to Argent-X</h2>
      <Form>
        <input type="button" value="Connect..." onClick={connect} />
        <InputTextWithCopy type="text" value={accountAddress} />
      </Form>
      <h2>Execute MultiCall</h2>
      <IncrementMulticall account={account} />
      <NavLink href="/">Back</NavLink>
    </main>
  );
};

export default ArgentX;

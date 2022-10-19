import styled from "styled-components";
import Link from "next/link";
import proxy from "lib/artifacts/proxy";
import DeployAccount from "components/DeployAccount";
import { useState, useEffect } from "react";
import useLocalStorage from "lib/useLocalStorage";
import { getKeyPair, getStarkKey } from "starknet/utils/ellipticCurve";
import useCall from "lib/useCall";
import { Account, SequencerProvider } from "starknet";
import { toBN } from "starknet/utils/number";

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

export const Component = () => {
  const [walletPrivateKey] = useLocalStorage("SnapWalletPrivateKey", "0x1");
  const [walletPublicKey, setWalletPublicKey] = useState("0x0");
  const [accountAddress, setAccountAddress] = useLocalStorage(
    "SnapWalletAccountAddress",
    ""
  );
  const [ethContractAddress] = useLocalStorage(
    "SnapEthContractAddress",
    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
  );
  const [account, setAccount] = useState();
  const [ethBalance, getEthBalance] = useCall(
    account,
    ethContractAddress,
    "balanceOf",
    [toBN(accountAddress.slice(2), "hex").toString(10)]
  );

  useEffect(() => {
    const keypair = getKeyPair(walletPrivateKey);
    const publicKey = getStarkKey(keypair);
    setWalletPublicKey(publicKey);
  }, [walletPrivateKey]);

  useEffect(() => {
    const keypair = getKeyPair(walletPrivateKey);
    const a = new Account(new SequencerProvider(), accountAddress, keypair);
    setAccount(a);
  }, [walletPrivateKey, accountAddress]);

  const copy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (e) {
      console.log("cannot account address to clipboard");
    }
  };

  return (
    <main>
      <Link href="/">Back</Link>
      <h2>Manage Account</h2>
      <Form>
        <label>Address</label>
        <Block>
          <ExpandedInput type="text" value={accountAddress} readOnly />
          <input
            type="button"
            value="Copy"
            onClick={() => {
              copy(accountAddress);
            }}
          />
        </Block>
      </Form>
      <h2>check ETH</h2>
      <Form>
        <label>Eth Address</label>
        <input type="text" value={ethContractAddress} readOnly />
        <Block>
          <input type="button" value="check" onClick={getEthBalance} />
          <ExpandedInput
            type="text"
            value={ethBalance?.length > 0 ? ethBalance[0] : "unknown"}
            readOnly
          />
        </Block>
      </Form>
      <DeployAccount
        compiledProxyContract={proxy}
        publicKey={walletPublicKey}
        setAccountAddress={setAccountAddress}
      />

      <Link href="/">Back</Link>
    </main>
  );
};

export default Component;

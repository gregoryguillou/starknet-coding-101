import styled from "styled-components";
import Link from "next/link";
import counter from "lib/artifacts/counter";
import DeployContract from "components/DeployContract";
import { useEffect, useState } from "react";
import useLocalStorage from "lib/useLocalStorage";
import { Account, SequencerProvider } from "starknet";
import { getKeyPair } from "starknet/utils/ellipticCurve";
import { toBN } from "starknet/utils/number";
import IncrementCounter from "components/IncrementCounter";
import useCall from "lib/useCall";

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

export const Contract = () => {
  const [walletPrivateKey] = useLocalStorage("SnapWalletPrivateKey", "");
  const [accountAddress] = useLocalStorage("SnapWalletAccountAddress", "0x1");
  const [account, setAccount] = useState();
  const [incrementContractAddress, setIncrementContractAddress] =
    useLocalStorage("SnapIncrementContractAddress", "0x1");
  const [ethContractAddress] = useLocalStorage(
    "SnapEthContractAddress",
    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
  );

  useEffect(() => {
    if (!walletPrivateKey || !accountAddress) {
      console.log("could not get account yet");
      return;
    }
    const account = new Account(
      new SequencerProvider(),
      accountAddress,
      getKeyPair(walletPrivateKey)
    );
    setAccount(account);
  }, [walletPrivateKey, accountAddress]);

  const [increment, getIncrement] = useCall(
    account,
    incrementContractAddress,
    "get_count"
  );

  const [ethBalance, getEthBalance] = useCall(
    account,
    ethContractAddress,
    "balanceOf",
    [toBN(accountAddress.slice(2), "hex").toString(10)]
  );

  return (
    <main>
      <Link href="/">Back</Link>
      <h2>Manage Contracts</h2>
      <DeployContract
        contract={counter}
        name="increment"
        setContractAddress={setIncrementContractAddress}
      />
      <h2>call get_count</h2>
      <Form>
        <label>Contract Address</label>
        <input type="text" value={incrementContractAddress} readOnly />
        <label>Count Value</label>
        <Block>
          <input type="button" value="check" onClick={getIncrement} />
          <ExpandedInput
            type="text"
            value={increment && increment.length > 0 ? increment[0] : "unknown"}
            readOnly
          />
        </Block>
      </Form>
      <h2>Manage/Check ETH</h2>
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
      <IncrementCounter account={account} />
      <Link href="/">Back</Link>
    </main>
  );
};

export default Contract;

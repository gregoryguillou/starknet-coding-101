import styled from "styled-components";
import { useDeployProxyAccount } from "lib";
import { useEffect } from "react";
import InputTextWithCopy from "./InputTextWithCopy";

const Form = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const accountClass =
  "0x3ee677c4cd437957db70f0d288f507cc74b497fa3a506ce8840cfd59e1909f";
const pluginClass =
  "0x031c70ed28f4b0faf39b2f97d8f0a61a36968319c13fe6f2051b8de5a15f3d9b";

export const DeployAccount = ({
  compiledProxyContract,
  publicKey,
  setAccountAddress,
}) => {
  const [address, status, transactionHash, runDeploy] = useDeployProxyAccount(
    compiledProxyContract,
    accountClass,
    publicKey,
    pluginClass
  );

  useEffect(() => {
    if (address) {
      setAccountAddress(address);
    }
  }, [address, setAccountAddress]);

  return (
    <main>
      <h2>deploy account</h2>
      <p>this section deploys the account on StarkNet.</p>
      <Form>
        <label>Transaction</label>
        <input type="text" value={transactionHash} disabled />
        <label>Contract Address</label>
        <InputTextWithCopy value={address} readOnly />
        <label>Deployment Status</label>
        <input type="text" value={status} disabled />
        <div>
          <input type="button" value="deploy" onClick={runDeploy} />
        </div>{" "}
      </Form>
    </main>
  );
};

export default DeployAccount;

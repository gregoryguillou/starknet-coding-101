import styled from "styled-components";
import { useDeployContract } from "lib";
import { useEffect } from "react";
import InputTextWithCopy from "./InputTextWithCopy";

const Form = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const DeployContract = ({ contract, name, setContractAddress }) => {
  const [address, status, transactionHash, runDeploy] =
    useDeployContract(contract);

  useEffect(() => {
    if (address?.length > 3) {
      setContractAddress(address);
    }
  }, [address, setContractAddress]);

  return (
    <main>
      <h2>deploy {name}</h2>
      <p>this section deploy {name}.json in starknet.</p>
      <Form>
        <label>{name} Transaction</label>
        <input type="text" value={transactionHash} readOnly />
        <label>{name} Contract Address</label>
        <InputTextWithCopy value={address} />
        <label>Deployment Status</label>
        <input type="text" value={status} readOnly />
        <div>
          <input type="button" value="deploy" onClick={runDeploy} />
        </div>{" "}
      </Form>
    </main>
  );
};

export default DeployContract;

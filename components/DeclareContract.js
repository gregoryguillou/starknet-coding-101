import styled from "styled-components";

import { useDeclare } from "lib";
import { useEffect } from "react";
import InputTextWithCopy from "./InputTextWithCopy";

const Form = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const DeclareContract = ({ contract, name, setClassHash }) => {
  const [classHash, status, transaction, runDeclare] = useDeclare(contract);

  useEffect(() => {
    setClassHash(classHash);
  }, [classHash, setClassHash]);

  return (
    <main>
      <h2>declare {name}</h2>
      <p>this section declare {name}.json in starknet.</p>
      <Form>
        <label>{name} Transaction</label>
        <input type="text" value={transaction} readOnly />
        <label>{name} Class</label>
        <InputTextWithCopy value={classHash} readOnly />
        <label>Deployment Status</label>
        <input type="text" value={status} readOnly />
        <div>
          <input type="button" value="declare" onClick={runDeclare} />
        </div>{" "}
      </Form>
    </main>
  );
};

export default DeclareContract;

import styled from "styled-components";
import { useExecute } from "lib";
import useLocalStorage from "lib/useLocalStorage";

const Form = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const incrementContract =
  "0x51e94d515df16ecae5be4a377666121494eb54193d854fcf5baba2b0da679c6";

export const IncrementCounter = ({ account }) => {
  const [incrementContractAddress] = useLocalStorage(
    "SnapIncrementContractAddress",
    incrementContract
  );

  const [status, transactionHash, execute] = useExecute(
    account,
    incrementContractAddress,
    "increment"
  );

  return (
    <main>
      <h2>increment counter</h2>
      <p>this section shows how to execute a transaction.</p>
      <Form>
        <label>Transaction Hash</label>
        <input type="text" value={transactionHash} readOnly />
        <label>Status</label>
        <input type="text" value={status} readOnly />
        <div>
          <input type="button" value="execute" onClick={execute} />
        </div>{" "}
      </Form>
    </main>
  );
};

export default IncrementCounter;

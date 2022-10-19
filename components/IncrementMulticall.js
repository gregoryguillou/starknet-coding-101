import styled from "styled-components";
import { useMulticall } from "lib";

const Form = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const incrementContract =
  "0xc7c324f8a19c150a2308a64bbb60f923b623ece1e6aa4c0b83d761111f02a6";

export const IncrementMulticall = ({ account }) => {
  const call = {
    contractAddress: incrementContract,
    entrypoint: "increment_uint",
    calldata: ["1", "0"],
  };

  const [status, transactionHash, execute] = useMulticall(account, [
    call,
    call,
  ]);

  return (
    <main>
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

export default IncrementMulticall;

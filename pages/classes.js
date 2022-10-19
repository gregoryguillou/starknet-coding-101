import Link from "next/link";
import account from "lib/artifacts/accountv0_plugin";
import plugin from "lib/artifacts/plugin";
import DeclareContract from "components/DeclareContract";

export const Component = () => {
  return (
    <main>
      <Link href="/">Back</Link>
      <h2>Deploy Classes</h2>
      <DeclareContract
        contract={account}
        name="accountv0"
        setClassHash={(classHash) => {
          console.log("account", classHash);
        }}
      />
      <DeclareContract
        contract={plugin}
        name="plugin"
        setClassHash={(classHash) => {
          console.log("account", classHash);
        }}
      />
      <Link href="/">Back</Link>
    </main>
  );
};

export default Component;

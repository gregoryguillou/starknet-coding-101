import Link from "next/link";

export const Index = () => {
  return (
    <main>
      <h2>Dapp</h2>
      <ol>
        <li>
          <Link href="/dapp-request">Key and Request</Link>
        </li>
        <li>
          <Link href="/dapp-execute">Dapp Execute</Link>
        </li>
      </ol>
      <h2>Argent X</h2>
      <ol>
        <li>
          <Link href="/argent-x">Simple Argent-X multicall</Link>
        </li>
        <li>
          <Link href="/authorize-x">Get and Sign w/ Argent-X</Link>
        </li>
      </ol>
      <h2>Wallet</h2>
      <ol>
        <li>
          <Link href="/wallet">Manage Key</Link>
        </li>
        <li>
          <Link href="/account">Deploy Account</Link>
        </li>
        <li>
          <Link href="/authorize">Authorize</Link>
        </li>
      </ol>
      <h2>Contracts</h2>
      <ol>
        <li>
          <Link href="/contract">Increment Contract</Link>
        </li>
        <li>
          <Link href="/classes">Declare Classes</Link>
        </li>
      </ol>
    </main>
  );
};

export default Index;

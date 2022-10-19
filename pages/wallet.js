import styled from "styled-components";
import { useEffect, useState } from "react";
import Link from "next/link";
import useLocalStorage from "lib/useLocalStorage";
import {
  genKeyPair,
  getKeyPair,
  getStarkKey,
} from "starknet/utils/ellipticCurve";

const NavLink = styled(Link)``;

const KeyForm = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const PrivateKey = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const PrivateKeyInput = styled.input`
  width: 100%;
`;

export const Wallet = () => {
  const [walletPrivateKey, setWalletPrivateKey] = useLocalStorage(
    "SnapWalletPrivateKey",
    "0x1"
  );
  const [walletPublicKey, setWalletPublicKey] = useState("0x0");

  const handlerFunction = (setPrivateKey) => {
    const handlePrivateKey = (event) => {
      if (event.target.value.startWith("0x")) {
        setPrivateKey(event.target.value);
      }
    };
    return handlePrivateKey;
  };

  useEffect(() => {
    const keypair = getKeyPair(walletPrivateKey);
    const publicKey = getStarkKey(keypair);
    setWalletPublicKey(publicKey);
  }, [walletPrivateKey]);

  const genPrivateKey = (setPrivateKey) => {
    const keypair = genKeyPair();
    const privateKey = `0x${keypair.getPrivate().toString(16)}`;
    setPrivateKey(privateKey);
  };

  return (
    <main>
      <NavLink href="/">Back</NavLink>
      <h2>Manage your keys</h2>
      <p>
        This page provides a number of functions to manage keys. Be careful, the
        session key should not be part of the wallet. It is just provided for to
        help testing the Dapp.
      </p>
      <h3>Wallet Keys</h3>
      <KeyForm>
        <label>Private Key</label>
        <PrivateKey>
          <PrivateKeyInput
            type="text"
            value={walletPrivateKey}
            onChange={handlerFunction(setWalletPrivateKey)}
          />
          <input
            type="button"
            value="random"
            onClick={() => {
              genPrivateKey(setWalletPrivateKey);
            }}
          />
        </PrivateKey>
        <label>Public Key</label>
        <input type="text" value={walletPublicKey} disabled />
      </KeyForm>
      <NavLink href="/">Back</NavLink>
    </main>
  );
};

export default Wallet;

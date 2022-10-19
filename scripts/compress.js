const fs = require("fs");
const { json } = require("starknet");
const lz = require("lz-string");

function compress(contract) {
  const file = `lib/artifacts/${contract}.js`;
  fs.writeFileSync(
    file,
    `// DO NOT EDIT: file generated from ${contract}.json

import { json } from "starknet";
import lz from "lz-string";

export const compiledContract = () => json.parse(lz.decompressFromBase64("${lz.compressToBase64(
      minimize(contract)
    )}"));

export default compiledContract;\n`
  );
}

function minimize(contract) {
  const data = fs.readFileSync(`contracts/artifacts/${contract}.json`, "ascii");
  return json.stringify(json.parse(data));
}

["accountv0_plugin", "counter", "plugin", "proxy"].map((contract) => {
  compress(contract);
  console.log(`file ${contract}.js: done`);
});

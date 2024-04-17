import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { toHex } from 'ethereum-cryptography/utils';
import * as fs from "fs";
import { execFileSync } from 'child_process';
import * as crypto from "crypto";
import path from 'path';

const privateKey = secp256k1.utils.randomPrivateKey();
const publicKey = secp256k1.getPublicKey(privateKey, false);
const address = keccak256(publicKey.slice(1)).slice(-20);
const password = crypto.randomBytes(32).toString('hex');
const gethDataDir = '/geth';
const chainID = 1337;

fs.existsSync(gethDataDir) || fs.mkdirSync(gethDataDir);

fs.writeFileSync('priv-key', toHex(privateKey));
fs.writeFileSync(path.join(gethDataDir, 'password'), password);
fs.writeFileSync(path.join(gethDataDir, 'chain_id'), chainID.toString());
fs.writeFileSync(path.join(gethDataDir, 'address'), toHex(address));

execFileSync('geth', ['account', 'import', '--datadir', gethDataDir, '--password', path.join(gethDataDir, 'password'), 'priv-key']);

let genesis = fs.readFileSync('genesis.json.template', 'utf8')
    .replaceAll('${CHAIN_ID}', chainID.toString())
    .replaceAll('${ADDRESS}', toHex(address));

fs.writeFileSync('genesis.json', genesis);

execFileSync('geth', ['init', '--datadir', gethDataDir, 'genesis.json']);

fs.rmSync('genesis.json');
fs.rmSync('genesis.json.template');
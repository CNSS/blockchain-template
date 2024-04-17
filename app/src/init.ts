import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { toHex } from 'ethereum-cryptography/utils';
import * as fs from "fs";
import { execFileSync } from 'child_process';
import * as crypto from "crypto";
import path from 'path';
import { config, loadConfig } from './config.js';

loadConfig();

const privateKey = secp256k1.utils.randomPrivateKey();
const publicKey = secp256k1.getPublicKey(privateKey, false);
const address = keccak256(publicKey.slice(1)).slice(-20);
const password = crypto.randomBytes(32).toString('hex');
const gethDataDir = '/geth';

fs.existsSync(gethDataDir) || fs.mkdirSync(gethDataDir);

fs.writeFileSync('priv-key', toHex(privateKey));
fs.writeFileSync(path.join(gethDataDir, 'password'), password);
fs.writeFileSync(path.join(gethDataDir, 'chain_id'), config.genesis.chain_id.toString());
fs.writeFileSync(path.join(gethDataDir, 'address'), toHex(address));

execFileSync('geth', ['account', 'import', '--datadir', gethDataDir, '--password', path.join(gethDataDir, 'password'), 'priv-key']);

let genesis = fs.readFileSync('genesis.json.template', 'utf8')
    .replaceAll('${CHAIN_ID}', config.genesis.chain_id.toString())
    .replaceAll('${TIMESTAMP}', config.genesis.timestamp)
    .replaceAll('${GAS_LIMIT}', config.genesis.gas_limit)
    .replaceAll('${DIFFICULTY}', config.genesis.difficulty)
    .replaceAll('${ADDRESS}', toHex(address));

fs.writeFileSync('genesis.json', genesis);

execFileSync('geth', ['init', '--datadir', gethDataDir, 'genesis.json']);

fs.rmSync('genesis.json');
fs.rmSync('genesis.json.template');

if(config.solc.version){
    execFileSync('yarn', ['add', `solc@${config.solc.version}`])
}
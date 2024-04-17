import { readFileSync } from "fs";
import { env } from "process";
import { Web3 } from 'web3';
import { Web3Account } from 'web3-eth-accounts';

let web3: Web3;
let funder: Web3Account;

const initWeb3 = () => {
    const funderPrivateKey = readFileSync('priv-key', 'utf8');
    const providerUrl = env.PROVIDER_URL ?? "http://127.0.0.1:58545/";
    fetch(providerUrl, { signal: AbortSignal.timeout(10000) });

    web3 = new Web3(providerUrl);
    funder = web3.eth.accounts.privateKeyToAccount(`0x${funderPrivateKey}`);
    web3.eth.accounts.wallet.add(funder);
    web3.defaultAccount = funder.address;
}

export { web3, funder, initWeb3 };
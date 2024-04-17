import { Web3Account } from 'web3-eth-accounts';
import { Contract, Web3 } from 'web3';
import solc from 'solc';
import * as fs from "fs";
import { exit } from 'process';
import { fundAccount } from './faucet.js';
import path from 'path';
import { EtherUnits } from 'web3-utils';
import { web3 } from './web3.js';
import { ContractConfig, config } from './config.js';
import { createHash, randomBytes } from 'crypto';

interface ChallengeContract {
    deploy_contract: Contract<any>;
    hash: string;
    config: ContractConfig;
}

interface Challenge {
    contracts: ChallengeContract[];
};

let challenge = {
    contracts: [] as ChallengeContract[]
};

let deployer: Web3Account;

const findImport = (_path: string): any => {
    const filename = path.join('contracts/', _path);
    if (!fs.existsSync(filename)) {
        return { error: 'File not found' };
    }
    return { contents: fs.readFileSync(filename, 'utf8') };
}

const compileContract = (sourceCode: string, contractName: string): { abi: any, bytecode: string } => {
    const input = {
        language: "Solidity",
        sources: {
            main: {
                content: sourceCode
            }
        },
        settings: {
            outputSelection: {
                "*":
                {
                    "*": ["abi", "evm.bytecode"]
                }
            },
            evmVersion: config.solc.evm_version
        },
    };

    const output = solc.compile(JSON.stringify(input), { import: findImport });
    const artifact = JSON.parse(output).contracts.main[contractName];

    return {
        abi: artifact.abi,
        bytecode: artifact.evm.bytecode.object,
    };
}

const deployContract = async (web3: Web3, abi: any, bytecode: string, value: string, args: any[], gas: string): Promise<Contract<any>> => {
    let contract = new web3.eth.Contract(abi);

    let tx = contract.deploy({ data: bytecode, arguments: args })

    if (!gas) {
        gas = (await tx.estimateGas({ from: deployer.address, value: value })).toString();
    }

    let deploy_contract = await tx.send({ from: deployer.address, value: value, gas: gas });

    if (!deploy_contract.options.address) {
        console.error('Failed to deploy contract');
        exit(1);
    }

    return deploy_contract;
}


const deployChallenge = async () => {
    if (!deployer) {
        deployer = web3.eth.accounts.create();
        if (await fundAccount(web3, deployer.address, web3.utils.toWei(config.deployer.balance.amount, config.deployer.balance.unit as EtherUnits)) === false) {
            console.error('Failed to fund deployer account');
            exit(1);
        }
        web3.eth.accounts.wallet.add(deployer);
    }

    await config.contracts.reduce(async (previous, contract) => {
        await previous;

        const filename = path.join('contracts/', contract.filename);
        const data = fs.readFileSync(filename, 'utf8');
        const constructor = contract.constructor;
        switch (contract.type) {
            case 'source': {
                const { abi, bytecode } = compileContract(data, contract.name);
                const value = web3.utils.toWei(constructor.value.amount, constructor.value.unit);
                const deploy_contract = await deployContract(web3, abi, bytecode, value, constructor.args, constructor.gas);
                const hash = createHash('sha1').update(bytecode).update(randomBytes(32)).digest('hex');
                let challengeContract = {
                    deploy_contract: deploy_contract,
                    hash: hash,
                    config: structuredClone(contract)
                };
                challenge.contracts.push(challengeContract);
                break;
            }
            case 'bytecode': {
                console.log('Deploying contract from bytecode is not supported');
                exit(1);
            }
            default:
                console.error('Invalid contract type');
                exit(1);
        }
    }, Promise.resolve());
};

export {
    ChallengeContract,
    Challenge,
    challenge,
    deployer,
    deployChallenge
};
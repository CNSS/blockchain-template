import { Web3Account } from 'web3-eth-accounts';
import { Contract, Web3 } from 'web3';
import solc from 'solc';
import * as fs from "fs";
import * as yaml from 'js-yaml';
import { exit } from 'process';
import { fundAccount } from './faucet.js';
import path from 'path';

export interface Challenge {
    description: string;
    contracts: {
        type: string;
        filename: string;
        name: string;
        deploy_contract: Contract<any>;
        constructor: {
            args: any[];
            value: string;
            gas: string;
        };
        checks: {
            func: string;
            args: any[];
            value: string;
            gas: string;
        }[];
        visible: boolean;
        show_address: boolean;
        show_filename: boolean;
    }[];
};

let deployer: Web3Account;

function compileContract(sourceCode: string, contractName: string): { abi: any, bytecode: string } {
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
            evmVersion: "paris"
        },
    };

    const output = solc.compile(JSON.stringify(input));
    const artifact = JSON.parse(output).contracts.main[contractName];

    return {
        abi: artifact.abi,
        bytecode: artifact.evm.bytecode.object,
    };
}

async function deployContract(web3: Web3, abi: any, bytecode: string, value: string, args: any[], gas: string): Promise<Contract<any>> {
    let contract = new web3.eth.Contract(abi);

    let tx = contract.deploy({ data: bytecode, arguments: args })

    if(!gas){
        gas = (await tx.estimateGas({ from: deployer.address, value: value })).toString();
    }

    let deploy_contract = await tx.send({ from: deployer.address, value: value, gas: gas});

    if (!deploy_contract.options.address) {
        console.error('Failed to deploy contract');
        exit(1);
    }

    return deploy_contract;
}

let challenge: Challenge;

export { challenge };

export const deployChallenge = async (web3: Web3) => {
    if (!deployer) {
        deployer = web3.eth.accounts.create();
        if (await fundAccount(web3, deployer.address,  web3.utils.toWei('1000', 'ether')) === false) {
            console.error('Failed to fund deployer account');
            exit(1);
        }
        web3.eth.accounts.wallet.add(deployer);
    }

    challenge = yaml.load(fs.readFileSync('challenge/challenge.yml', 'utf8')) as Challenge;

    await challenge.contracts.reduce(async (previous, contract) => {
        await previous;

        const filename = path.join('challenge/contracts/', contract.filename);
        const data = fs.readFileSync(filename, 'utf8');
        const constructor = contract.constructor;
        switch (contract.type) {
            case 'source': {
                const { abi, bytecode } = compileContract(data, contract.name);
                const deploy_contract = await deployContract(web3, abi, bytecode, constructor.value, constructor.args, constructor.gas);
                contract.deploy_contract = deploy_contract;
                break;
            }
            case 'bytecode': {
                const deploy_contract = await deployContract(web3, [], data, constructor.value, constructor.args, constructor.gas);
                contract.deploy_contract = deploy_contract;
                break;
            }
            default:
                console.error('Invalid contract type');
                exit(1);
        }
    }, Promise.resolve());
};
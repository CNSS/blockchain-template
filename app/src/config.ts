import * as yaml from 'js-yaml';
import { EtherUnits } from 'web3-utils';
import { readFileSync } from 'fs';

interface Amount {
    amount: string;
    unit: EtherUnits;
}

interface FaucetConfig {
    enabled: boolean;
    amount: string;
    unit: string;
    limit: Amount;
}

interface DeployerConfig {
    balance: Amount;
}

interface ContractConfig {
    type: string;
    filename: string;
    name: string;
    constructor: {
        args: any[];
        value: Amount;
        gas: string;
    };
    checks: {
        func: string;
        args: any[];
        value: Amount;
        gas: string;
        check: boolean;
    }[];
    visible: boolean;
    show_file: boolean;
    show_address: boolean;
    show_filename: boolean;
}

interface GenesisConfig {
    chain_id: number;
    timestamp: string;
    gas_limit: string;
    difficulty: string;
}

interface SolcConfig {
    version: string
    evm_version: string
}

interface Config {
    description: string;
    wrong_flag_message: string;
    faucet: FaucetConfig;
    deployer: DeployerConfig;
    contracts: ContractConfig[];
    solc: SolcConfig;
    genesis: GenesisConfig;
};

let config: Config;

const loadConfig = () => {
    config = yaml.load(readFileSync('config.yml', 'utf-8')) as Config;
}

export {
    FaucetConfig,
    DeployerConfig,
    ContractConfig,
    Config,
    config,
    loadConfig
};
import * as yaml from 'js-yaml';
import { readFileSync } from 'fs';

interface FaucetConfig {
    enabled: boolean;
    amount: string;
    unit: string;
    limit: {
        amount: string;
        unit: string;
    }
}

interface DeployerConfig {
    balance: {
        amount: string;
        unit: string;
    }
}

interface ContractConfig {
    type: string;
    filename: string;
    name: string;
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
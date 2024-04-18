import { Request, Response } from 'express';
import { challenge } from './deploy.js';
import { config } from './config.js';

const boxHandler = (req: Request, res: Response) => {
    let contracts = [] as any[];
    challenge.contracts.forEach(contract => {
        if(!contract.config.visible) {
            return;
        }

        contracts.push({
            address: contract.config.show_address ? (contract.deploy_contract.options.address ?? 'Not Deployed') : 'Hidden',
            name: contract.config.name,
            filename: contract.config.show_filename ? contract.config.filename : 'Hidden',
            hash: contract.hash,
            showFile: contract.config.show_file
        });
    });

    res.json({
        description: config.description,
        faucet: config.faucet,
        contracts: contracts
    });
}

export { boxHandler };
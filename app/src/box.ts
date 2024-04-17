import { Request, Response } from 'express';
import { challenge } from './deploy.js';

export const boxHandler = async (req: Request, res: Response) => {
    let r = {
        description: challenge.description,
        contracts: [] as any[]
    };
    challenge.contracts.forEach((contract)=>{
        if(contract.visible){
            r.contracts.push({
                filename: contract.show_filename ? contract.filename : 'hidden',
                name: contract.name,
                address: contract.show_address ? (contract.deploy_contract ? contract.deploy_contract.options.address : 'not deployed') : 'hidden'
            });
        }
    })

    res.json(r);
};
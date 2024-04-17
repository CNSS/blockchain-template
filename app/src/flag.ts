import { Request, Response } from "express";
import { challenge } from "./deploy.js";
import { Web3Request } from "./index.js";
import { readFileSync } from "fs";

export const flagHandler = async (req: Request, res: Response) => {
    const web3 = (req as Web3Request).web3;
    let flag = true;
    try{
        for (const contract of challenge.contracts) {
            for(const check of contract.checks) {
                let deploy_contract = contract.deploy_contract;
                let tx = deploy_contract.methods[check.func](...check.args)
                
                let gas = check.gas;
                if (!gas) {
                    gas = (await tx.estimateGas({from: web3.defaultAccount, value: check.value})).toString();
                }
                
                let result = await tx.call({
                    from: web3.defaultAccount,
                    value: check.value,
                    gas: gas
                }) as boolean;
    
                if(!result){
                    flag = false;
                    break;
                }
            }
    
            if(!flag){
                break
            }
        }
    }catch(e){
        flag = false;
    }

    if(!flag) {
        res.render('flag', { flag: 'Are you sure? OK, here is the flag: flag{??????} or maybe not……' });
    }else{
        res.render('flag', { flag: readFileSync('/flag').toString() });
    }
}
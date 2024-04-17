import { Request, Response } from "express";
import { challenge, deployer } from "./deploy.js";
import { readFileSync } from "fs";
import { config } from "./config.js";

export const flagHandler = async (req: Request, res: Response) => {
    let flag = true;
    try{
        for (const contract of challenge.contracts) {
            for(const check of contract.config.checks) {
                let deploy_contract = contract.deploy_contract;
                let tx = deploy_contract.methods[check.func](...check.args)
                
                let gas = check.gas;
                if (!gas) {
                    gas = (await tx.estimateGas({from: deployer.address, value: check.value})).toString();
                }
                
                let result = await tx.call({
                    from: deployer.address,
                    value: check.value,
                    gas: gas
                }) as boolean;
    
                if(check.check && !result){
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
        res.render('flag', {
            faucetEnabled: config.faucet.enabled,
            flag: config.wrong_flag_message
        });
    }else{
        res.render('flag', { 
            faucetEnabled: config.faucet.enabled,
            flag: `Wow, how do you achieve that. Here's you flag: <b>${readFileSync('/flag', 'utf-8')}</b>`
        });
    }
}
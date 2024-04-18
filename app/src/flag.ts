import { Request, Response } from "express";
import { challenge, deployer } from "./deploy.js";
import { execFileSync } from 'child_process';
import { config } from "./config.js";
import { web3 } from "./web3.js";

const check = async () => {
    let flag = true;
    try {
        for (const contract of challenge.contracts) {
            for (const check of contract.config.checks) {
                let deploy_contract = contract.deploy_contract;
                let tx = deploy_contract.methods[check.func](...check.args)
                const value = web3.utils.toWei(check.value.amount, check.value.unit);
                let gas = check.gas;
                if (!gas) {
                    gas = (await tx.estimateGas({ from: deployer.address, value: value })).toString();
                }

                let result = await tx.call({
                    from: deployer.address,
                    value: value,
                    gas: gas
                }) as boolean;

                if (check.check && !result) {
                    flag = false;
                    break;
                }
            }

            if (!flag) {
                break
            }
        }
    } catch (e) {
        flag = false;
    }

    return flag;
}

const flagHandler = async (req: Request, res: Response) => {
    if (! await check()) {
        res.json({
            success: false,
            flag: config.wrong_flag_message
        });
    } else {
        res.json({
            success: true,
            flag: `Wow, how do you achieve that? Here's your flag: ${execFileSync('/readflag').toString()}`
        });
    }
}

export { flagHandler };
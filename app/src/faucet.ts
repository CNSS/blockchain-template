import { Request, Response } from 'express';
import { Web3 } from 'web3';
import { isAddress } from 'web3-validator'
import { web3 } from './web3.js';
import { config } from './config.js';

let fundTotalAmountNumber = BigInt(0);

const fundAccount = async (web3: Web3, account: string, amount: string): Promise<boolean> => {
    try {
        let result = await web3.eth.sendTransaction({
            from: web3.defaultAccount,
            to: account,
            value: amount,
        });

        if (result.status !== BigInt(1)) {
            return false;
        }

        return true;

    } catch (error) {
        return false;
    }
};

const faucetFundHandler = async (req: Request, res: Response) => {
    if (!config.faucet.enabled) {
        res.json({ status: 'error', message: 'Faucet is disabled' });
        return;
    }

    let address = req.body.address;

    if (!address || typeof address !== 'string') {
        res.json({ status: 'error', message: 'Invalid request' });
        return;
    }

    if (!isAddress(address)) {
        res.json({ status: 'error', message: 'Invalid address' });
        return;
    }

    let fundAmount = Web3.utils.toWei(config.faucet.amount, config.faucet.unit);
    let fundAmountNumber = BigInt(fundAmount);
    let fundLimitAmount = Web3.utils.toWei(config.faucet.limit.amount, config.faucet.limit.unit);
    let fundLimitAmountNumber = BigInt(fundLimitAmount);


    if (fundTotalAmountNumber + fundAmountNumber > fundLimitAmountNumber) {
        res.json({ status: 'error', message: 'Oh, you just need so much, don\'t you' });
        return;
    }

    if (await fundAccount(web3, address, fundAmount) === false) {
        res.json({ status: 'error', message: 'Failed to fund account' });
        return;
    }

    fundTotalAmountNumber += fundAmountNumber;

    res.json({ status: 'ok', message: 'Successfully funded your account' });
}

const faucetViewHandler = async (req: Request, res: Response) => {
    res.render('faucet', {
        faucet: {
            enabled: config.faucet.enabled,
            amount: config.faucet.amount,
            unit: config.faucet.unit,
            limit: {
                amount: config.faucet.limit.amount,
                unit: config.faucet.limit.unit
            }
        }
    });
}

export {fundAccount, faucetFundHandler, faucetViewHandler};
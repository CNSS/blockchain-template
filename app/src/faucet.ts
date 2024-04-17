import { Request, Response } from 'express';
import { Web3 } from 'web3';
import { EtherUnits } from 'web3-utils';
import { web3 } from './web3.js';
import { config } from './config.js';
import exp from 'constants';

interface FundRecord {
    [address: string]: {
        value: bigint;
    }
}

let fundRecords: FundRecord = {};

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
        res.status(400).json({ status: 'error', message: 'Faucet is disabled' });
        return;
    }

    let address = req.body.address;

    if (!address || typeof address !== 'string') {
        res.status(400).json({ status: 'error', message: 'Invalid request' });
        return;
    }

    if (/^0x[0-9a-fA-F]{40}$/.test(address) === false) {
        res.status(400).json({ status: 'error', message: 'Invalid address' });
        return;
    }

    let fundAmount = Web3.utils.toWei(config.faucet.amount, config.faucet.unit as EtherUnits);
    let fundLimitAmount = Web3.utils.toWei(config.faucet.limit.amount, config.faucet.limit.unit as EtherUnits);

    if(!fundRecords[address]){
        fundRecords[address] = {
            value: BigInt(0)
        }
    }

    if (fundRecords[address].value >= BigInt(fundLimitAmount)) {
        res.status(400).json({ status: 'error', message: 'Oh, you just need so much, don\'t you' });
        return;
    }

    if (await fundAccount(web3, address, fundAmount) === false) {
        res.status(500).json({ status: 'error', message: 'Failed to fund account' });
        return;
    }

    fundRecords[address].value += BigInt(fundAmount);

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
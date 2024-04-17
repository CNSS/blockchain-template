import { Request, Response } from 'express';
import { Web3 } from 'web3';
import { Web3Request } from './index.js';

export const fundAccount = async (web3: Web3, account: string, amount: string): Promise<boolean> => {
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

export const faucetHandler = async (req: Request, res: Response) => {

    let address = req.body.address;
    console.log(address)

    if (!address || typeof address !== 'string') {
        res.status(400).json({ status: 'error', message: 'Invalid request' });
        return;
    }

    if (/^0x[0-9a-fA-F]{40}$/.test(address) === false) {
        res.status(400).json({ status: 'error', message: 'Invalid address' });
        return;
    }

    if (await fundAccount((req as Web3Request).web3, address, Web3.utils.toWei('100', 'ether')) === false) {
        res.status(500).json({ status: 'error', message: 'Failed to fund account' });
        return;
    }

    res.json({ status: 'ok', message: 'Successfully fund your account!' });
}
import express from 'express';
import { proxyHandler } from './proxy.js';
import { Web3 } from 'web3';
import { deployChallenge, challenge } from './deploy.js';
import { env } from 'process';
import { time } from 'console';
import * as fs from "fs";
import { boxHandler } from './box.js';
import { faucetHandler } from './faucet.js';
import { flagHandler } from './flag.js';
import path from 'path';
import rateLimit from 'express-rate-limit';

export interface Web3Request extends express.Request {
    web3: Web3;
}

const funderPrivateKey = fs.readFileSync('priv-key', 'utf8');
const providerUrl = env.PROVIDER_URL ?? "http://127.0.0.1:58545/";
fetch(providerUrl, {signal: AbortSignal.timeout(10000)});

const web3 = new Web3(providerUrl);
const funder = web3.eth.accounts.privateKeyToAccount(`0x${funderPrivateKey}`);
web3.eth.accounts.wallet.add(funder);
web3.defaultAccount = funder.address;
await deployChallenge(web3);

const limiter = rateLimit({
	windowMs: 5 * 1000, 
	limit: 4,
	standardHeaders: false, 
	legacyHeaders: false, 
})

const app = express();
const port = 3000;

app.post('/rpc', express.raw({ type: "*/*" }), proxyHandler);

app.use(express.json());
app.set("view engine", "ejs");
app.use('/static', express.static('static'));

app.use((req, res, next) => {
    (req as Web3Request).web3 = web3;
    next();
})

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/faucet', (req, res) => {
    res.render('faucet');
});

app.post('/faucet', limiter, faucetHandler);

app.get('/flag', limiter, flagHandler);

app.use((req, res) => {
    res.render('index', { challenge: challenge });
})

app.use(function (req, res) {
    process.on('uncaughtException', function(err) { 
        console.log(err);
        res.status(500).send('Internal Server Error');
    }) 
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
import express from 'express';
import { Response } from 'express';
import { proxyHandler } from './proxy.js';
import { deployChallenge, challenge } from './deploy.js';
import { faucetHandler } from './faucet.js';
import { flagHandler } from './flag.js';
import rateLimit from 'express-rate-limit';
import { loadConfig } from './config.js';
import { initWeb3 } from './web3.js';
import { config } from './config.js';

loadConfig();
initWeb3();

await deployChallenge();

const limiter = rateLimit({
	windowMs: 30 * 1000, 
	limit: 10,
	standardHeaders: false, 
	legacyHeaders: false, 
})

const app = express();
const port = 3000;

app.post('/rpc', express.raw({ type: "*/*" }), proxyHandler);

app.use(express.json());
app.set("view engine", "ejs");
app.use('/static', express.static('static'));

app.get('/health', (_, res) => {
    res.json({ status: 'ok'});
});

app.post('/faucet', limiter, faucetHandler);

app.get('/flag', limiter, flagHandler);

app.get('/faucet', (_, res: Response) => {
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
});

app.get('/', (_, res: Response) => {
    let contracts = [] as any[];
    challenge.contracts.forEach(contract => {
        if(!contract.config.visible) {
            return;
        }

        contracts.push({
            address: contract.config.show_address ? (contract.deploy_contract.options.address ?? 'Not Deployed') : 'Hidden',
            name: contract.config.name,
            filename: contract.config.show_filename ? contract.config.filename : 'Hidden'
        });
    });
    res.render('index', {
        faucetEnabled: config.faucet.enabled,
        description: config.description,
        contracts: contracts
    });
});

app.all('*', (_, res: Response) => {
    res.status(404).send('Not Found');
});

app.use(function (_, res: Response) {
    process.on('uncaughtException', function(err) { 
        console.log(err);
        res.status(500).send('Internal Server Error');
    }) 
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
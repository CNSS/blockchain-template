import express from 'express';
import { Response } from 'express';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { proxyHandler } from './proxy.js';
import { deployChallenge, challenge } from './deploy.js';
import { faucetFundHandler, faucetViewHandler } from './faucet.js';
import { downloadHandler } from './download.js';
import { flagHandler } from './flag.js';
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

app.use(morgan('combined'));
app.post('/rpc', express.raw({ type: "*/*" }), proxyHandler);

app.use(express.json());
app.set("view engine", "ejs");
app.use('/static', express.static('static'));

app.get('/health', (_, res) => {
    res.json({ status: 'ok'});
});

app.post('/faucet', limiter, faucetFundHandler);

app.get('/flag', limiter, flagHandler);

app.get('/faucet', faucetViewHandler);

app.get('/download', downloadHandler);

app.get('/', (_, res: Response) => {
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
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
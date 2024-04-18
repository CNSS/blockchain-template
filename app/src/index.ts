import express from 'express';
import { Response } from 'express';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { proxyHandler } from './proxy.js';
import { deployChallenge, challenge } from './deploy.js';
import { faucetHandler } from './faucet.js';
import { downloadHandler } from './download.js';
import { flagHandler } from './flag.js';
import { loadConfig } from './config.js';
import { initWeb3 } from './web3.js';
import { boxHandler } from './box.js';
import { readFileSync } from 'fs';

loadConfig();
initWeb3();

await deployChallenge();

const indexHtml = (readFileSync("ui/index.html")).toString();
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
app.use('/assets', express.static('ui/assets'));

app.get('/download', downloadHandler);

app.get('/api/health', (_, res) => {
    res.json({ status: 'ok'});
});

app.get('/api/box', boxHandler);

app.get('/api/flag', limiter, flagHandler);

app.post('/api/faucet', limiter, faucetHandler);

app.all('*', (_, res: Response) => {
    res.send(indexHtml);
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
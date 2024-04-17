import { Request, Response } from 'express';
import { challenge } from './deploy.js';
import { readFileSync } from 'fs';
import path from 'path';

const downloadHandler = async (req: Request, res: Response) => {
    let hash = req.query.hash;
    if(!hash){
        res.redirect('/');
        return;
    }

    for (const contract of challenge.contracts){
        if (contract.hash === hash) {
            if (!contract.config.show_file) {
                break;
            }

            let content = readFileSync(path.join('contracts/', contract.config.filename));

            if (contract.config.show_filename) {
                res.setHeader('Content-Disposition', `attachment; filename=${contract.config.filename}`);
            } else {
                res.setHeader('Content-Disposition', `attachment; filename=${hash}.sol`);
            }

            res.setHeader('Content-Type', 'octet/stream');
            res.send(content);

            return;
        }
    }

    res.redirect('/');
    return;
};

export { downloadHandler };
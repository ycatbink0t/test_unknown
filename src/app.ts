import { config } from 'dotenv';
config();

import express, { Express } from 'express';
import { Server } from 'http';

import { connectDb } from './db';
import { router } from './routers';

async function initApp(): Promise<Express> {
    const dbConnection = connectDb();
    const app = express();

    app.use(express.json());
    app.all('*', (req, _res, next) => {
        console.log(`${req.method} ${req.url} ${JSON.stringify(req.body)}`);
        next();
    });
    app.use('/api', router);

    await dbConnection;
    return app;
}

const port = process.env.PORT || 3000;
let server: Server;

function initServer(): Promise<Server> {
    return new Promise<Server>(async resolve => {
        const app = await initApp();
        server = app.listen(port, () => {
            console.log(`Server listening on ${JSON.stringify(server.address())}`);
            resolve(server);
        });
    });
}

export { initApp, initServer };

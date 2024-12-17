import express from 'express';
import cors from 'cors';
import createError from 'http-errors';

import contactsRouter from './routers/contacts.js';

import { getEnvVar } from './utils/getEnvVar.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const setupServer = () => {
    const app = express();

    app.use(express.json());
    app.use(cors());

    app.use('/contacts', contactsRouter);

    app.use(notFoundHandler);

    app.use(errorHandler);

    const port = Number(getEnvVar('PORT', 4839));

    app.listen(port, () => console.log(`Server runningon on ${port} port`));
};

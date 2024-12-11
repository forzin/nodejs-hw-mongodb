import express from 'express';
import cors from 'cors';

import * as contactServices from './services/contacts-service.js';
import { getEnvVar } from './utils/getEnvVar.js';

export const setupServer = () => {
    const app = express();

    app.use(express.json());
    app.use(cors());

    app.get('/contacts', async (req, res) => {
        try {
           const data = await contactServices.getContacts();

           res.json({
               status: 200,
               message: 'Successfully found contacts',
               data
           });
        } catch (error) {
            console.log(`Error ${error.message}`);
        }
    });

    app.get('/contacts/:id', async (req, res) => {
        try {
           const { id } = req.params;

           const data = await contactServices.getContactById(id);

           if (!data) {
               res.status(404).json({
                   status: 404,
                   message: 'Contact not found'
                });
            };

           res.json({
               status: 200,
               message: `Successfully found contact with id ${id}!`,
               data
           });
        } catch (error) {
            console.log(`Error ${error.message}`);
        }
    });

    app.get((req, res) => {
        res.status(404).json({
            message: `${req.url} not found`
        });
    });

    app.get((error, req, res, next) => {
        res.status(500).json({
            message: `Server error`,
            error: error.message,
        });
    });

    const port = Number(getEnvVar('PORT', 4839));

    app.listen(port, () => console.log(`Server runningon on ${port} port`));
};

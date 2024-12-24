import * as contactServices from '../services/contacts-service.js';

import createError from 'http-errors';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

import { sortByList } from '../db/models/Contact.js';

export const getContactController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);

    const data = await contactServices.getContacts({ page, perPage, sortBy, sortOrder });

    res.json({
        status: 200,
        message: 'Successfully found contacts',
        data
    });
};

export const getContactByIdController = async (req, res) => {

    const { id } = req.params;

    const data = await contactServices.getContactById(id);

    if (!data) {
        throw createError(404, 'Contact not found');
    };

    res.json({
        status: 200,
        message: `Successfully found contact with id ${id}`,
        data
    });
};

export const addContactController = async (req, res) => {

    const data = await contactServices.addContact(req.body);

    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data
    });
};

export const patchContactController = async (req, res) => {
    const { id } = req.params;
    const result = await contactServices.updateContact(id, req.body);

    if (!result) {
        throw createError(404, `Contact not found`);
    };

    res.json({
        status: 200,
        message: 'Successfully patched a contact!',
        data: result
    });
};

export const deleteContactController = async (req, res) => {
    const { id } = req.params;
    const data = await contactServices.deleteContact({ _id: id });

    if (!data) {
        throw createError(404, `Contact not found`);
    };

    res.status(204).send();
}

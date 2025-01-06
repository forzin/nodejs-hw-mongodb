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
    const { _id: userId } = req.user;
    const { id: _id } = req.params;

    const data = await contactServices.getContactById({_id, userId});

    if (!data) {
        throw createError(404, 'Contact not found');
    };

    res.json({
        status: 200,
        message: `Successfully found contact with id ${_id}`,
        data
    });
};

export const addContactController = async (req, res) => {
    const { _id: userId } = req.user;
    const data = await contactServices.addContact({...req.body, userId});

    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data
    });
};

export const patchContactController = async (req, res) => {
    const { id: _id } = req.params;
    const { _id: userId } = req.user;
    const result = await contactServices.updateContact({_id, userId}, req.body);

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
    const { id: _id } = req.params;
    const { _id: userId } = req.user;
    const data = await contactServices.deleteContact({_id, userId});

    if (!data) {
        throw createError(404, `Contact not found`);
    };

    res.status(204).send();
}

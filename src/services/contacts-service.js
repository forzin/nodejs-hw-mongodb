import ContactCollection from '../db/models/Contact.js';

import { calcPaginationData } from '../utils/calcPaginationData.js';

export const getContacts = async ({ page = 1, perPage = 10, sortBy = '_id', sortOrder = 'asc' }) => {
    const limit = perPage;
    const skip = (page - 1) * limit;
    const data = await ContactCollection.find().skip(skip).limit(limit).sort({[sortBy] : sortOrder});
    const totalItems = await ContactCollection.countDocuments();

    const paginationData = calcPaginationData({ data, page, perPage})

    return {
        data,
        totalItems,
        ...paginationData
    };
};

export const getContactById = id => ContactCollection.findById(id);

export const addContact = payload => ContactCollection.create(payload);

export const updateContact = async (_id, payload) => {
    const result = await ContactCollection.findOneAndUpdate({ _id }, payload, { returnDocument: "after" });

    if (!result) return null;

    return result;
};

export const deleteContact = filter => ContactCollection.findOneAndDelete( filter );

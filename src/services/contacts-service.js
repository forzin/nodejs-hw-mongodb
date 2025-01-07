import ContactCollection from '../db/models/Contact.js';

import { calcPaginationData } from '../utils/calcPaginationData.js';

export const getContacts = async ({ page = 1, perPage = 10, sortBy = '_id', sortOrder = 'asc', userId = {} }) => {
    const limit = perPage;
    const skip = (page - 1) * limit;
    const contactsQuery = ContactCollection.find();

    if (userId) {
        contactsQuery.where('userId').equals(userId);
    };

    const data = await contactsQuery.skip(skip).limit(limit).sort({[sortBy] : sortOrder});
    const totalItems = await ContactCollection.find().merge(contactsQuery).countDocuments();

    const paginationData = calcPaginationData({ totalItems, page, perPage });

    return {
        data,
        totalItems,
        page,
        perPage,
        ...paginationData
    };
};

export const getContactById = id => ContactCollection.findById(id);

export const getContact = filter => ContactCollection.findOne(filter);

export const addContact = payload => ContactCollection.create(payload);

export const updateContact = async (filter, payload) => {
    const result = await ContactCollection.findOneAndUpdate(filter, payload, { returnDocument: "after" });

    if (!result) return null;

    return result;
};

export const deleteContact = filter => ContactCollection.findOneAndDelete( filter );

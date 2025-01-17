import { Schema, model } from 'mongoose';

import { typeList } from '../../constants/contactConstants.js';

import { handleSaveError, setUpdateSettings } from './hooks.js';

const contactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: String,
    isFavourite: {
        type: Boolean,
        default: false,
    },
    contactType: {
        type: String,
        enum: typeList,
        required: true,
        default: 'personal'
    },
    photo: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, { versionKey: false, timestamps: true, });

contactSchema.post('save', handleSaveError);

contactSchema.pre('findOneAndUpdate', setUpdateSettings);

contactSchema.post('findOneAndUpdate', handleSaveError);

export const sortByList = ['name'];

const ContactCollection = model('contact', contactSchema);

export default ContactCollection;

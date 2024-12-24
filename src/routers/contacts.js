import {Router} from 'express';

import * as contactsController from '../controllers/controllersContacts.js';

import { ctrlWarapper } from '../decorators/ctrlwrapper.js';

import { validateBody } from '../middlewares/validateBody.js';

import { isValidId } from '../middlewares/isValidId.js';

import { contactAddSchema, contactUpdateSchema } from '../validation/contactsValidation.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWarapper(contactsController.getContactController));

contactsRouter.get('/:id', isValidId, ctrlWarapper(contactsController.getContactByIdController));

contactsRouter.post('/', validateBody(contactAddSchema), ctrlWarapper(contactsController.addContactController));

contactsRouter.patch('/:id', isValidId, validateBody(contactUpdateSchema), ctrlWarapper(contactsController.patchContactController));

contactsRouter.delete('/:id', isValidId,  ctrlWarapper(contactsController.deleteContactController));

export default contactsRouter;

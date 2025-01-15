import {Router} from 'express';

import * as contactsController from '../controllers/controllersContacts.js';

import { authenticate } from '../middlewares/autheticate.js';

import { ctrlWarapper } from '../decorators/ctrlwrapper.js';

import { validateBody } from '../middlewares/validateBody.js';

import { upload } from '../middlewares/multer.js';

import { isValidId } from '../middlewares/isValidId.js';

import { contactAddSchema, contactUpdateSchema } from '../validation/contactsValidation.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWarapper(contactsController.getContactController));

contactsRouter.get('/:id', isValidId, ctrlWarapper(contactsController.getContactByIdController));

contactsRouter.post('/', upload.single('photo'), validateBody(contactAddSchema), ctrlWarapper(contactsController.addContactController));

contactsRouter.patch('/:id', upload.single('photo'), isValidId, validateBody(contactUpdateSchema), ctrlWarapper(contactsController.patchContactController));

contactsRouter.delete('/:id', isValidId,  ctrlWarapper(contactsController.deleteContactController));

export default contactsRouter;

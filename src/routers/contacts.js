import {Router} from 'express';

import * as contactsController from '../controllers/controllersContacts.js';

import { ctrlWarapper } from '../decorators/ctrlwrapper.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWarapper(contactsController.getContactController));

contactsRouter.get('/:id', ctrlWarapper(contactsController.getContactByIdController));

contactsRouter.post('/', ctrlWarapper(contactsController.addContactController));

contactsRouter.patch('/:id', ctrlWarapper(contactsController.patchContactController));

contactsRouter.delete('/:id', ctrlWarapper(contactsController.deleteContactController));

export default contactsRouter;

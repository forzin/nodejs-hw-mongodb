import { Router } from "express";

import * as authController from '../controllers/authController.js'

import { validateBody } from '../middlewares/validateBody.js';

import { authRegisterSchema, authLoginSchema } from "../validation/authValidation.js";

import { ctrlWarapper } from '../decorators/ctrlwrapper.js';

const authRouter = Router();

authRouter.post('/register', validateBody(authRegisterSchema), ctrlWarapper(authController.registerController));

authRouter.post('/login', validateBody(authLoginSchema), ctrlWarapper(authController.loginController));

authRouter.post('/refresh', ctrlWarapper(authController.refreshController));

authRouter.post('/logout', ctrlWarapper(authController.logoutController));

export default authRouter;

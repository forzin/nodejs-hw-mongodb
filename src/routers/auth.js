import { Router } from "express";

import * as authController from '../controllers/authController.js'

import { validateBody } from '../middlewares/validateBody.js';

import { authRegisterSchema, authLoginSchema, loginWithGoogleOAuthSchema } from "../validation/authValidation.js";

import { ctrlWarapper } from '../decorators/ctrlwrapper.js';

import { resetPasswordSchema } from '../validation/authValidation.js';

import { resetPasswordController } from '../controllers/authController.js';

import { requestResetEmailSchema } from '../validation/authValidation.js';

import { requestResetEmailController } from '../controllers/authController.js';

const authRouter = Router();

authRouter.post('/register', validateBody(authRegisterSchema), ctrlWarapper(authController.registerController));

authRouter.post('/login', validateBody(authLoginSchema), ctrlWarapper(authController.loginController));

authRouter.post('/refresh', ctrlWarapper(authController.refreshController));

authRouter.post('/send-reset-email', validateBody(requestResetEmailSchema), ctrlWarapper(requestResetEmailController));

authRouter.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWarapper(resetPasswordController));

authRouter.post('/logout', ctrlWarapper(authController.logoutController));

authRouter.get('/get-oauth-url', ctrlWarapper(authController.getGoogleOAuthUrlController));

authRouter.post('/confirm-oauth', validateBody(loginWithGoogleOAuthSchema), ctrlWarapper(authController.loginWithGoogleController));

export default authRouter;

import express from 'express';
import { authController } from '../controllers/auth.controller';
import { validateBody } from '../validators/validate-body.middleware';
import { validateLoginUser, validateRegisterUser } from '../validators/dto.validators';

const router = express.Router();

router.post('/login', validateBody(validateLoginUser), authController.handlerLogin.bind(authController));
router.post('/register', validateBody(validateRegisterUser), authController.handlerRegister.bind(authController));

export default router;

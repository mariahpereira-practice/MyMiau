import express from 'express';
import { getGatosDisponiveis, getMeusGatos, saveGatoController, updateGatoController } from '../controllers/gatos.controller';
import { requiredAuth, UserRole } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';

const router = express.Router();

router.get('/meus', requiredAuth, authorizeRoles(UserRole.TUTOR, UserRole.ADMIN), getMeusGatos);
router.get('/disponiveis', requiredAuth, authorizeRoles(UserRole.CATSITTER, UserRole.MODERATOR, UserRole.ADMIN), getGatosDisponiveis);
router.post('/', requiredAuth, authorizeRoles(UserRole.TUTOR, UserRole.ADMIN, UserRole.MODERATOR), saveGatoController);
router.put('/:id', requiredAuth, authorizeRoles(UserRole.TUTOR, UserRole.ADMIN, UserRole.MODERATOR), updateGatoController);

export default router;

import express from 'express';
import { GatoController } from '../controllers/gatos.controller';
import { requiredAuth, UserRole } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';
import { validateBody } from '../validators/validate-body.middleware';
import { validateCreateGato, validateUpdateGato } from '../validators/dto.validators';

const router = express.Router();
const gatoController = new GatoController();

router.get('/meus', requiredAuth, authorizeRoles(UserRole.TUTOR, UserRole.ADMIN), gatoController.getMeusGatos);
router.get('/disponiveis', requiredAuth, authorizeRoles(UserRole.CATSITTER, UserRole.MODERATOR, UserRole.ADMIN), gatoController.getGatosDisponiveis);
router.post('/', requiredAuth, authorizeRoles(UserRole.TUTOR, UserRole.ADMIN, UserRole.MODERATOR), validateBody(validateCreateGato), gatoController.saveGato);
router.put('/:id', requiredAuth, authorizeRoles(UserRole.TUTOR, UserRole.ADMIN, UserRole.MODERATOR), validateBody(validateUpdateGato), gatoController.updateGato);

export default router;

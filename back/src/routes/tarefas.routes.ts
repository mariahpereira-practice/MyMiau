import express from 'express';
import { tarefaController } from '../controllers/tarefas.controller';
import { requiredAuth, UserRole } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';
import { validateBody } from '../validators/validate-body.middleware';
import { validateCreateTarefa, validateUpdateTarefa } from '../validators/dto.validators';

const router = express.Router();

router.post('/tarefa/:idGato', requiredAuth, authorizeRoles(UserRole.TUTOR, UserRole.ADMIN, UserRole.MODERATOR), validateBody(validateCreateTarefa), tarefaController.postTarefa);
router.get('/:idGato', requiredAuth, tarefaController.getListaTarefas);
router.delete('/tarefa/:idGato/:idTarefa', requiredAuth, authorizeRoles(UserRole.TUTOR, UserRole.ADMIN, UserRole.MODERATOR), tarefaController.deleteTarefa);
router.put('/tarefa/:idGato/:idTarefa', requiredAuth, validateBody(validateUpdateTarefa), tarefaController.updateTarefa);

export default router;



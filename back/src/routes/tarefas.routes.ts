import express from 'express';
import { requiredAuth, UserRole } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';
import { validateBody } from '../validators/validate-body.middleware';
import { validateCreateTarefa, validateUpdateTarefa } from '../validators/dto.validators';
import { tarefaController } from '../controllers/tarefas.controller';

const router = express.Router();

router.post('/tarefa/:idGato', requiredAuth, authorizeRoles(UserRole.TUTOR, UserRole.ADMIN, UserRole.MODERATOR), validateBody(validateCreateTarefa), tarefaController.handlerPostTarefa.bind(tarefaController));
router.get('/:idGato', requiredAuth, tarefaController.handlerGetListaTarefas.bind(tarefaController));
router.delete('/tarefa/:idGato/:idTarefa', requiredAuth, authorizeRoles(UserRole.TUTOR, UserRole.ADMIN, UserRole.MODERATOR), tarefaController.handlerDeleteTarefa.bind(tarefaController));
router.put('/tarefa/:idGato/:idTarefa', requiredAuth, validateBody(validateUpdateTarefa), tarefaController.handlerUpdateTarefa.bind(tarefaController));

export default router;



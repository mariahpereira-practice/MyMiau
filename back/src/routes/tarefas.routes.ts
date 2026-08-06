import express from 'express';
import { getListaTarefas, postTarefa, updateTarefa, deleteTarefa } from '../controllers/tarefas.controller';
import { requiredAuth, UserRole } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';

const router = express.Router();

router.post('/tarefa/:idGato', requiredAuth, authorizeRoles(UserRole.TUTOR, UserRole.ADMIN, UserRole.MODERATOR), postTarefa);
router.get('/:idGato', requiredAuth, getListaTarefas);
router.delete('/tarefa/:idGato/:idTarefa', requiredAuth, authorizeRoles(UserRole.TUTOR, UserRole.ADMIN, UserRole.MODERATOR), deleteTarefa);
router.put('/tarefa/:idGato/:idTarefa', requiredAuth, updateTarefa);

export default router;



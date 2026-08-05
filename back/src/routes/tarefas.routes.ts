import express from 'express';
import { getListaTarefas, postListaTarefas, postTarefa, updateTarefa } from '../controllers/tarefas.controller';
import { requiredAuth, UserRole } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';

const router = express.Router();

router.get('/:idGato', requiredAuth, getListaTarefas);
// router.patch('/:idTarefa/status', requiredAuth, authorizeRoles(UserRole.CATSITTER, UserRole.ADMIN, UserRole.MODERATOR), updateTarefa);

export default router;

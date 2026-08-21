import { NextFunction, Request as ExpressRequest, Response } from 'express';
import { Body, Controller, Delete, Get, Middlewares, Path, Post, Put, Request, Route, Security, SuccessResponse } from 'tsoa';
import { CreateTarefaInputDTO, TarefaResponseDTO, UpdateTarefaInputDTO } from '../dtos/tarefa.dto';
import { TarefaService, tarefasService } from '../services/tarefas.service';
import { UserRole } from '../dtos/user.dto';
import { authorizeRoles } from '../middlewares/role.middleware';
import { validateBody } from '../validators/validate-body.middleware';
import { validateCreateTarefa, validateUpdateTarefa } from '../validators/dto.validators';

interface TarefasResponseDTO {
  tarefas: TarefaResponseDTO[];
}

interface MessageResponseDTO {
  message: string;
}

@Route('tarefas')
export class TarefaController extends Controller {
  constructor(private readonly service: TarefaService = tarefasService) {
    super();
  }

  async handlerGetListaTarefas(req: ExpressRequest<{ idGato: string }>, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      return res.json(await this.getListaTarefas(Number(req.params.idGato), req));
    } catch (error) {
      next(error);
    }
  }

  async handlerPostTarefa(req: ExpressRequest<{ idGato: string }, {}, CreateTarefaInputDTO>, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      return res.status(201).json(await this.postTarefa(Number(req.params.idGato), req.body, req));
    } catch (error) {
      next(error);
    }
  }

  async handlerUpdateTarefa(req: ExpressRequest<{ idGato: string; idTarefa: string }, {}, UpdateTarefaInputDTO>, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const result = await this.updateTarefa(Number(req.params.idGato), Number(req.params.idTarefa), req.body, req);
      return res.status(req.user?.role === 'CATSITTER' ? 200 : 201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async handlerDeleteTarefa(req: ExpressRequest<{ idGato: string; idTarefa: string }>, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      return res.status(200).json(await this.deleteTarefa(Number(req.params.idGato), Number(req.params.idTarefa), req));
    } catch (error) {
      next(error);
    }
  }

  @Get('{idGato}')
  @Security('jwt')
  @SuccessResponse('200', 'Tarefas encontradas')
  async getListaTarefas(@Path() idGato: number, @Request() req: any): Promise<TarefasResponseDTO> {
    if (req.user?.role === 'CATSITTER') {
      return { tarefas: await this.service.listTarefasCatSitter({ idGato, idCatSitter: req.user.id }) };
    }
    const idTutor = req.user?.id;
    if (!idTutor) {
      this.setStatus(401);
      throw new Error('Usuário não autenticado.');
    }
    return { tarefas: await this.service.listTarefasTutor({ idGato, idTutor }) };
  }

  @Post('tarefa/{idGato}')
  @Security('jwt')
  @Middlewares(authorizeRoles(UserRole.TUTOR, UserRole.ADMIN, UserRole.MODERATOR), validateBody(validateCreateTarefa))
  @SuccessResponse('201', 'Tarefa criada')
  async postTarefa(@Path() idGato: number, @Body() data: CreateTarefaInputDTO, @Request() req: any): Promise<MessageResponseDTO> {
    const idTutor = req.user?.id;
    if (!idTutor) {
      this.setStatus(401);
      throw new Error('Usuário não autenticado.');
    }
    await this.service.criarTarefa(idGato, idTutor, data);
    return { message: 'Tarefa registrada com sucesso!' };
  }

  @Put('tarefa/{idGato}/{idTarefa}')
  @Security('jwt')
  @Middlewares(validateBody(validateUpdateTarefa))
  @SuccessResponse('200', 'Tarefa atualizada')
  async updateTarefa(@Path() idGato: number, @Path() idTarefa: number, @Body() data: UpdateTarefaInputDTO, @Request() req: any): Promise<MessageResponseDTO> {
    if (req.user?.role === 'CATSITTER') {
      await this.service.atualizarStatusTarefa(idTarefa, req.user.id);
      return { message: 'Status da tarefa atualizado com sucesso!' };
    }
    const idTutor = req.user?.id;
    if (!idTutor) {
      this.setStatus(401);
      throw new Error('Usuário não autenticado.');
    }
    await this.service.atualizarTarefa(idGato, idTutor, data, idTarefa);
    this.setStatus(201);
    return { message: 'Tarefa atualizada com sucesso!' };
  }

  @Delete('tarefa/{idGato}/{idTarefa}')
  @Security('jwt')
  @Middlewares(authorizeRoles(UserRole.TUTOR, UserRole.ADMIN, UserRole.MODERATOR))
  @SuccessResponse('200', 'Tarefa excluída')
  async deleteTarefa(@Path() idGato: number, @Path() idTarefa: number, @Request() req: any): Promise<MessageResponseDTO> {
    const idTutor = req.user?.id;
    if (!idTutor) {
      this.setStatus(401);
      throw new Error('Usuário não autenticado.');
    }
    await this.service.deletarTarefaServico(idGato, idTarefa, idTutor);
    return { message: 'Tarefa deletada com sucesso!' };
  }
}

export const tarefaController = new TarefaController();

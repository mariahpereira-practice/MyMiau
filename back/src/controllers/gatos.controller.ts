import { NextFunction, Response } from 'express';
import { Request as ExpressRequest } from 'express';
import { GatosService, gatosService } from '../services/gatos.service';
import {
  GatoCreateInputDTO,
  GatoCreateRequestDTO,
  GatoResponseDTO,
  GatoUpdateInputDTO,
} from '../dtos/gato.dto';
import { Body, Controller, Get, Middlewares, Path, Post, Put, Query, Request, Route, Security, SuccessResponse } from 'tsoa';
import { UserRole } from '../dtos/user.dto';
import { authorizeRoles } from '../middlewares/role.middleware';
import { validateBody } from '../validators/validate-body.middleware';
import { validateCreateGato, validateUpdateGato } from '../validators/dto.validators';


@Route('gatos')
export class GatoController extends Controller {
  private readonly _gatoService: GatosService;

  constructor(service: GatosService = gatosService) {
    super();
    this._gatoService = service;
  }

  async handlerSaveGato(
    req: ExpressRequest<{}, {}, GatoCreateRequestDTO>,
    res: Response, next: NextFunction): 
    Promise<Response | void> { 
    try {
      const body = req.body;
      const result = await this.saveGato(body, req);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  @Post('/')
  @Security('jwt')
  @Middlewares(authorizeRoles(UserRole.TUTOR, UserRole.ADMIN, UserRole.MODERATOR), validateBody(validateCreateGato))
  @SuccessResponse('201', 'Gato criado com sucesso')
  async saveGato(
      @Body() body: GatoCreateRequestDTO,
      @Request() req: ExpressRequest,
    ): Promise<GatoResponseDTO> {
        const idTutor = req.user?.id;
        if (!idTutor) {
              this.setStatus(401);
              throw new Error('Usuário não autenticado.');
        }
  
        const payload: GatoCreateInputDTO = {
              ...body,
              tutor_id: idTutor,
        };
        return this._gatoService.saveGato(payload);
  }

  async handlerUpdateGato(
    req: ExpressRequest<{ id: string }, {}, GatoUpdateInputDTO>, 
    res: Response, next: NextFunction): 
    Promise<Response | void> {
    try {
      const gatoUpdated = await this.updateGato(
        Number(req.params.id),
        req.body,
        req,
      );
      return res.json(gatoUpdated);
    } catch (error) {
      next(error);
    }
  };

  @Put('{id}')
  @Security('jwt')
  @Middlewares(authorizeRoles(UserRole.TUTOR, UserRole.ADMIN, UserRole.MODERATOR), validateBody(validateUpdateGato))
  @SuccessResponse('200', 'Gato atualizado com sucesso')
  async updateGato(
      @Path() id: number,
      @Body() data: GatoUpdateInputDTO,
      @Request() req: ExpressRequest,
    ): Promise<GatoResponseDTO> {
        const idTutor = req.user?.id;
        if (!idTutor) {
              this.setStatus(401);
              throw new Error('Usuário não autenticado.');
        }
  
        return this._gatoService.updateGato(id, idTutor, data);
  }

  async handlerGetGatosDisponiveis(
    req: ExpressRequest, 
    res: Response<GatoResponseDTO[]>, 
    next: NextFunction): 
    Promise<Response | void> {
  try {
    const { search, searchGato, searchTutor } = req.query;
    const gatos = await this.getGatosDisponiveis(
      req,
      search as string | undefined,
      searchGato as string | undefined,
      searchTutor as string | undefined,
    );
    return res.json(gatos);
  } catch (error) {
    next(error);
  }
  };

  @Get('/disponiveis')
  @Security('jwt')
  @Middlewares(authorizeRoles(UserRole.CATSITTER, UserRole.MODERATOR, UserRole.ADMIN))
  @SuccessResponse('200', 'Gatos disponíveis encontrados')
  async getGatosDisponiveis(
      @Request() req: ExpressRequest,
      @Query() search?: string,
      @Query() searchGato?: string,
      @Query() searchTutor?: string,
      ): Promise<GatoResponseDTO[]> {
        const idUser = req.user?.id;
        if (!idUser) {
            this.setStatus(401);
            throw new Error('Usuário não autenticado.');
        }
  
        return this._gatoService.listGatos({
            searchGato: searchGato ?? search,
            searchTutor,
            disponiveis: true,
        }, idUser);
  }

  async handlerGetMeusGatos(
    req: ExpressRequest, 
    res: Response<GatoResponseDTO[]>,
    next: NextFunction): 
    Promise<Response | void> {
  try {
    const { search, searchGato, searchTutor } = req.query;
    const meusGatos = await this.getMeusGatos(
      req,
      search as string | undefined,
      searchGato as string | undefined,
      searchTutor as string | undefined,
    );
    return res.json(meusGatos);
  } catch (error) {
    next(error);
  }
  };

  @Get('/meus')
  @Security('jwt')
  @Middlewares(authorizeRoles(UserRole.TUTOR, UserRole.ADMIN))
  @SuccessResponse('200', 'Gatos do tutor encontrados')
  async getMeusGatos(
      @Request() req: ExpressRequest,
      @Query() search?: string,
      @Query() searchGato?: string,
      @Query() searchTutor?: string,
      ): Promise<GatoResponseDTO[]> {
        const idUser = req.user?.id;
        if (!idUser) {
            this.setStatus(401);
            throw new Error('Usuário não autenticado.');
        }

        return this._gatoService.listGatos({
            searchGato: searchGato ?? search,
            searchTutor,
        }, idUser);
  }
  
}

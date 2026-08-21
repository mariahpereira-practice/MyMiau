/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TarefaController } from './../controllers/tarefas.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { GatoController } from './../controllers/gatos.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './../controllers/auth.controller';
import { expressAuthentication } from './../middlewares/tsoa-auth';
// @ts-ignore - no great way to install types from subpackage
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';

const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "TarefaStatus": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["PENDENTE"]},{"dataType":"enum","enums":["CONCLUIDA"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TarefaResponseDTO": {
        "dataType": "refObject",
        "properties": {
            "idTarefa": {"dataType":"double","required":true},
            "gato_id": {"dataType":"double","required":true},
            "descricao": {"dataType":"string","required":true},
            "pontos": {"dataType":"double","required":true},
            "status": {"ref":"TarefaStatus","required":true},
            "concluida_por": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}]},
            "concluida_em": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"enum","enums":[null]}]},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TarefasResponseDTO": {
        "dataType": "refObject",
        "properties": {
            "tarefas": {"dataType":"array","array":{"dataType":"refObject","ref":"TarefaResponseDTO"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MessageResponseDTO": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateTarefaInputDTO": {
        "dataType": "refObject",
        "properties": {
            "descricao": {"dataType":"string","required":true},
            "pontos": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateTarefaInputDTO": {
        "dataType": "refObject",
        "properties": {
            "descricao": {"dataType":"string"},
            "pontos": {"dataType":"double"},
            "status": {"ref":"TarefaStatus"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GatoResponseDTO": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "nomeGato": {"dataType":"string","required":true},
            "idadeGato": {"dataType":"double","required":true},
            "pesoGato": {"dataType":"double","required":true},
            "peloGato": {"dataType":"double","required":true},
            "racaGato": {"dataType":"string","required":true},
            "idIcone": {"dataType":"double","required":true},
            "tutor_id": {"dataType":"double","required":true},
            "tutorNome": {"dataType":"string","required":true},
            "disponivel_para_cuidado": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":[0]},{"dataType":"enum","enums":[1]}],"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GatoCreateRequestDTO": {
        "dataType": "refObject",
        "properties": {
            "nomeGato": {"dataType":"string","required":true},
            "idadeGato": {"dataType":"double","required":true},
            "pesoGato": {"dataType":"double","required":true},
            "peloGato": {"dataType":"double","required":true},
            "racaGato": {"dataType":"string","required":true},
            "idIcone": {"dataType":"double","required":true},
            "disponivel_para_cuidado": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":[0]},{"dataType":"enum","enums":[1]},{"dataType":"boolean"}]},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GatoUpdateInputDTO": {
        "dataType": "refObject",
        "properties": {
            "nomeGato": {"dataType":"string"},
            "idadeGato": {"dataType":"double"},
            "pesoGato": {"dataType":"double"},
            "peloGato": {"dataType":"double"},
            "racaGato": {"dataType":"string"},
            "idIcone": {"dataType":"double"},
            "disponivel_para_cuidado": {"dataType":"union","subSchemas":[{"dataType":"boolean"},{"dataType":"enum","enums":[0]},{"dataType":"enum","enums":[1]}]},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserRole": {
        "dataType": "refEnum",
        "enums": ["TUTOR","CATSITTER","MODERATOR","ADMIN"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserResponseDTO": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "username": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "role": {"ref":"UserRole","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AuthResponseDTO": {
        "dataType": "refObject",
        "properties": {
            "jwt": {"dataType":"string","required":true},
            "user": {"ref":"UserResponseDTO","required":true},
            "role": {"ref":"UserRole","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginUserInputDTO": {
        "dataType": "refObject",
        "properties": {
            "identifier": {"dataType":"string"},
            "password": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RegisterUserInputDTO": {
        "dataType": "refObject",
        "properties": {
            "username": {"dataType":"string"},
            "email": {"dataType":"string"},
            "password": {"dataType":"string"},
            "role": {"ref":"UserRole"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"ignore","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsTarefaController_getListaTarefas: Record<string, TsoaRoute.ParameterSchema> = {
                idGato: {"in":"path","name":"idGato","required":true,"dataType":"double"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/tarefas/:idGato',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TarefaController)),
            ...(fetchMiddlewares<RequestHandler>(TarefaController.prototype.getListaTarefas)),

            async function TarefaController_getListaTarefas(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTarefaController_getListaTarefas, request, response });

                const controller = new TarefaController();

              await templateService.apiHandler({
                methodName: 'getListaTarefas',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTarefaController_postTarefa: Record<string, TsoaRoute.ParameterSchema> = {
                idGato: {"in":"path","name":"idGato","required":true,"dataType":"double"},
                data: {"in":"body","name":"data","required":true,"ref":"CreateTarefaInputDTO"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/tarefas/tarefa/:idGato',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TarefaController)),
            ...(fetchMiddlewares<RequestHandler>(TarefaController.prototype.postTarefa)),

            async function TarefaController_postTarefa(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTarefaController_postTarefa, request, response });

                const controller = new TarefaController();

              await templateService.apiHandler({
                methodName: 'postTarefa',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTarefaController_updateTarefa: Record<string, TsoaRoute.ParameterSchema> = {
                idGato: {"in":"path","name":"idGato","required":true,"dataType":"double"},
                idTarefa: {"in":"path","name":"idTarefa","required":true,"dataType":"double"},
                data: {"in":"body","name":"data","required":true,"ref":"UpdateTarefaInputDTO"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.put('/tarefas/tarefa/:idGato/:idTarefa',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TarefaController)),
            ...(fetchMiddlewares<RequestHandler>(TarefaController.prototype.updateTarefa)),

            async function TarefaController_updateTarefa(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTarefaController_updateTarefa, request, response });

                const controller = new TarefaController();

              await templateService.apiHandler({
                methodName: 'updateTarefa',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTarefaController_deleteTarefa: Record<string, TsoaRoute.ParameterSchema> = {
                idGato: {"in":"path","name":"idGato","required":true,"dataType":"double"},
                idTarefa: {"in":"path","name":"idTarefa","required":true,"dataType":"double"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.delete('/tarefas/tarefa/:idGato/:idTarefa',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TarefaController)),
            ...(fetchMiddlewares<RequestHandler>(TarefaController.prototype.deleteTarefa)),

            async function TarefaController_deleteTarefa(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTarefaController_deleteTarefa, request, response });

                const controller = new TarefaController();

              await templateService.apiHandler({
                methodName: 'deleteTarefa',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsGatoController_saveGato: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"GatoCreateRequestDTO"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/gatos',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(GatoController)),
            ...(fetchMiddlewares<RequestHandler>(GatoController.prototype.saveGato)),

            async function GatoController_saveGato(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsGatoController_saveGato, request, response });

                const controller = new GatoController();

              await templateService.apiHandler({
                methodName: 'saveGato',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsGatoController_updateGato: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                data: {"in":"body","name":"data","required":true,"ref":"GatoUpdateInputDTO"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.put('/gatos/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(GatoController)),
            ...(fetchMiddlewares<RequestHandler>(GatoController.prototype.updateGato)),

            async function GatoController_updateGato(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsGatoController_updateGato, request, response });

                const controller = new GatoController();

              await templateService.apiHandler({
                methodName: 'updateGato',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsGatoController_getGatosDisponiveis: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                search: {"in":"query","name":"search","dataType":"string"},
                searchGato: {"in":"query","name":"searchGato","dataType":"string"},
                searchTutor: {"in":"query","name":"searchTutor","dataType":"string"},
        };
        app.get('/gatos/disponiveis',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(GatoController)),
            ...(fetchMiddlewares<RequestHandler>(GatoController.prototype.getGatosDisponiveis)),

            async function GatoController_getGatosDisponiveis(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsGatoController_getGatosDisponiveis, request, response });

                const controller = new GatoController();

              await templateService.apiHandler({
                methodName: 'getGatosDisponiveis',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsGatoController_getMeusGatos: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                search: {"in":"query","name":"search","dataType":"string"},
                searchGato: {"in":"query","name":"searchGato","dataType":"string"},
                searchTutor: {"in":"query","name":"searchTutor","dataType":"string"},
        };
        app.get('/gatos/meus',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(GatoController)),
            ...(fetchMiddlewares<RequestHandler>(GatoController.prototype.getMeusGatos)),

            async function GatoController_getMeusGatos(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsGatoController_getMeusGatos, request, response });

                const controller = new GatoController();

              await templateService.apiHandler({
                methodName: 'getMeusGatos',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_login: Record<string, TsoaRoute.ParameterSchema> = {
                input: {"in":"body","name":"input","required":true,"ref":"LoginUserInputDTO"},
        };
        app.post('/auth/login',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.login)),

            async function AuthController_login(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_login, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'login',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_register: Record<string, TsoaRoute.ParameterSchema> = {
                input: {"in":"body","name":"input","required":true,"ref":"RegisterUserInputDTO"},
        };
        app.post('/auth/register',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.register)),

            async function AuthController_register(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_register, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'register',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await Promise.any(secMethodOrPromises);

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }

                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

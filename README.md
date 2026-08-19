# My Miau API

API REST desenvolvida com Node.js, Express e TypeScript para conectar tutores de gatos e catsitters.

## Objetivo

- Permitir que tutores cadastrem e gerenciem gatos.
- Permitir que tutores criem, alterem e excluam tarefas de cuidado.
- Permitir que catsitters consultem gatos disponíveis e concluam tarefas.
- Controlar acesso por autenticação e perfil de usuário.

## Tecnologias

- Node.js e Express
- TypeScript em modo estrito
- MariaDB para persistência
- JWT e bcryptjs para autenticação
- Jest, ts-jest e Supertest para testes

## Execução

Na pasta `back`:

```bash
npm install
npm run typecheck
npm run build
npm start
```

Para desenvolvimento:

```bash
npm run dev
```

Para executar os testes:

```bash
npm test
```

## Autenticação

O cadastro e o login retornam um JWT. Nas rotas protegidas, envie o token no cabeçalho:

```http
Authorization: Bearer <token>
```

As rotas `/api/auth/register` e `/api/auth/login` são públicas porque são utilizadas para criar uma sessão.
Após o login, use o campo `jwt` retornado para acessar as demais rotas.

Os perfis utilizados pela API são `TUTOR`, `CATSITTER`, `MODERATOR` e `ADMIN`. O middleware de autenticação valida o token e carrega o usuário; o middleware de autorização restringe o acesso conforme o perfil.

## Rotas da API

### Autenticação

| Método | Rota | Proteção | Descrição |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Pública | Cadastra um usuário |
| POST | `/api/auth/login` | Pública | Autentica um usuário e retorna JWT |

### Gatos

| Método | Rota | Perfil | Descrição |
| --- | --- | --- | --- |
| GET | `/api/gatos/meus` | TUTOR, ADMIN | Lista gatos do usuário autenticado |
| GET | `/api/gatos/disponiveis` | CATSITTER, MODERATOR, ADMIN | Lista gatos disponíveis |
| POST | `/api/gatos` | TUTOR, ADMIN, MODERATOR | Cadastra um gato |
| PUT | `/api/gatos/:id` | TUTOR, ADMIN, MODERATOR | Altera um gato, respeitando ownership do tutor |

### Tarefas

| Método | Rota | Proteção | Descrição |
| --- | --- | --- | --- |
| GET | `/api/tarefas/:idGato` | JWT | Lista tarefas do gato, respeitando o perfil |
| POST | `/api/tarefas/tarefa/:idGato` | TUTOR, ADMIN, MODERATOR | Cria uma tarefa |
| PUT | `/api/tarefas/tarefa/:idGato/:idTarefa` | JWT | Atualiza tarefa ou conclui como catsitter |
| DELETE | `/api/tarefas/tarefa/:idGato/:idTarefa` | TUTOR, ADMIN, MODERATOR | Exclui uma tarefa |

Todas as respostas de erro são encaminhadas ao middleware central de erros. Dados de entrada inválidos são rejeitados com HTTP `400` pelo middleware de validação de DTOs.

## DTOs e validação

Os validadores ficam centralizados em `src/validators/dto.validators.ts` e são aplicados às rotas por `validateBody`, em `src/validators/validate-body.middleware.ts`.

A validação verifica, entre outros pontos:

- campos obrigatórios;
- tipos dos valores;
- strings vazias;
- números inválidos ou negativos;
- valores permitidos para `role` e `status`;
- campos desconhecidos.

As validações de DTO cuidam do formato da entrada. Regras de negócio, ownership e permissões permanecem nos services/actions.

## Organização do projeto

```text
src/
├── config/          # Configuração e cliente de banco
├── controllers/     # Adaptação entre HTTP e serviços
├── dtos/            # Contratos de entrada e saída
├── middlewares/     # Autenticação, autorização, erros e logs
├── models/          # Modelos e regras de domínio/actions
├── repositories/    # Interfaces e SQL de persistência
├── routes/          # Definição das rotas Express
├── services/        # Orquestração dos casos de uso
└── validators/      # Validação centralizada dos corpos das requisições
```

Os repositories recebem um `DatabaseClient`, permitindo substituir o banco real por fakes nos testes. Services, actions e controllers recebem suas dependências por construtor, com composição manual na inicialização.

## Logs

O middleware `requestLogger` é registrado globalmente em `src/app.ts` e registra em JSON:

- método;
- URL;
- status HTTP;
- duração em milissegundos;
- identificador do usuário, quando autenticado.

Senhas, tokens e corpos das requisições não são registrados.

## Testes

Os testes estão em `__test__/` e cobrem validators, middlewares, repositories, services e endpoints de autenticação, gatos e tarefas. Repositories são testados com `FakeDatabaseClient`, sem exigir conexão real com MariaDB.

Execute:

```bash
npm test -- --runInBand
```


## Créditos e uso de IA

Este projeto foi desenvolvido pelo aluno com apoio do **GitHub Copilot**, utilizando o modelo **GPT-5.6 Luna** como ferramenta de assistência.

A IA ajudou principalmente em:

- revisão de controllers, services, middlewares e repositories;
- criação e revisão de validadores de DTO;
- elaboração de testes unitários e de integração;
- melhorias na documentação e nos comandos de execução.

As decisões finais, implementação, revisão, execução dos testes e responsabilidade pelo código são do aluno.
# Projeto Conécta - Sistema de Gerenciamento de Usuários

## Descrição

Sistema de gerenciamento de usuários desenvolvido com NestJS (backend) e ReactJS (frontend), utilizando TypeScript. O sistema oferece autenticação segura, gerenciamento de usuários e uma interface intuitiva.

## Objetivo

Desenvolver uma aplicação com NestJS (backend) e ReactJS (frontend), ambos utilizando TypeScript, para gerenciar informações de usuários. O sistema deve ser robusto, seguro e fácil de usar, proporcionando uma experiência fluida tanto para administradores quanto para usuários regulares.

## Descrição do Sistema

### 1. Gerenciamento de Usuários

- Cadastrar novos usuários
- Autenticar usuários com login seguro
- Listar, editar e excluir informações de usuários (com permissões específicas para administradores)

### 2. Interface Amigável

- Tela de login para acessar o sistema
- Tela de cadastro para novos usuários
- Tela de listagem de usuários (para administradores) ou perfil do usuário (para usuários regulares)

## Tecnologias Utilizadas

### Backend

- NestJS com TypeScript
- PostgreSQL
- TypeORM
- JWT
- Jest
- Swagger

### Frontend

- ReactJS com TypeScript
- Context API
- React Router
- TailwindCSS
- Axios

## Pré-requisitos

- Node.js 22+
- Docker e Docker Compose
- PostgreSQL (se rodando localmente)

## Configuração do Ambiente

### Usando Docker (Recomendado)

1. Clone o repositório:

```bash
git clone [URL_DO_REPOSITÓRIO]
cd projeto-conectar
```

2. Inicie os containers:

```bash
docker-compose up -d
```

Observações:
- Ao iniciar o Docker, os containers do backend, frontend e banco de dados PostgreSQL serão iniciados automaticamente.
- O processo também irá adicionar ou atualizar dois usuários específicos mencionados a seguir.
- O frontend estará disponível no endereço http://localhost:4173 (porta 4173).

### Configuração Manual

1. Backend:

```bash
cd backend
npm install
npm run start:dev
```

```bash
# cria 2 users
npm run create-users
```

| role  | email             | password |
| ----- | ----------------- | -------- |
| admin | admin@example.com | 123456   |
| user  | user@example.com  | 123456   |

2. Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Estrutura do Projeto

```
projeto-conectar/
├── backend/
│   ├── src/
│   │   ├── auth/           # Autenticação e autorização
│   │   ├── users/          # Gerenciamento de usuários
│   │   └── ...
│   ├── test/              # Testes e2e
│   └── scripts/           # Scripts de configuração
├── frontend/
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/        # Páginas da aplicação
│   │   └── ...
└── docker-compose.yml
```

## API Endpoints

### Autenticação

- `POST /auth/register` - Registro de novo usuário
- `POST /auth/login` - Login de usuário

### Usuários

- `GET /users` - Listar usuários (apenas admin)
- `GET /users/inactive` - Listar usuários inativos (apenas admin)
- `GET /users/:id` - Obter usuário específico
- `PUT /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Remover usuário (apenas admin)

## Documentação da API

A documentação completa da API está disponível através do Swagger UI:

- URL: `http://localhost:3000/api`
- Autenticação: Bearer Token

## Testes

### Backend

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

### Frontend

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e
```

## Variáveis de Ambiente

### Backend (.env)

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=conecta

# JWT
JWT_SECRET=your-super-secret-key-change-in-production

# Environment
NODE_ENV=development
```

## Decisões de Design e Arquitetura

1. **Backend**

   - Uso do NestJS para uma arquitetura modular e escalável
   - TypeORM para mapeamento objeto-relacional
   - JWT para autenticação stateless
   - Validação de dados com class-validator
   - Documentação com Swagger

2. **Frontend**

   - Context API para gerenciamento de estado
   - React Router para navegação
   - TailwindCSS para estilização
   - Axios para requisições HTTP
   - Componentes reutilizáveis

3. **Segurança**

   - Senhas criptografadas
   - Tokens JWT com expiração
   - Proteção de rotas
   - Validação de dados
   - Sanitização de inputs

4. **Escalabilidade**
   - Arquitetura modular
   - Separação de responsabilidades
   - Código limpo e organizado
   - Documentação clara
   - Testes automatizados

## Interface

- Tela de login
  | ![](mock-interface\iPhone-12-PRO-192.168.0.100.png) | ![](<mock-interface\iPhone-12-PRO-192.168.0.100(1).png>) |
  | ---------------------------------------------------- | -------------------------------------------------------- |

- Tela em tema claro e escuro
  | ![](mock-interface\Oneplus-Nord-2-192.168.0.100.png) | ![](<mock-interface\iPhone-12-PRO-192.168.0.100(2).png>) |
  | ---------------------------------------------------- | -------------------------------------------------------- |

- Responsividade
  | ![](mock-interface\Macbook-Air-192.168.0.100.png) | ![](mock-interface\Galaxy-Fold2-192.168.0.100.png) |
  | ------------------------------------------------- | -------------------------------------------------- |

## Notas

Muitas das minhas escolhas foram baseadas em hábitos e nas ferramentas que uso no meu dia a dia.
O estilo minimalista reflete uma preferência pessoal, pois traz conforto e facilidade de uso, além de ser uma escolha simples que facilita a aceitação por outras pessoas.

No backend, utilizei ferramentas como JWT, Swagger, PostgreSQL e Docker, tanto por hábito quanto por serem escolhas práticas e simples de implementar.
A arquitetura do backend segue o padrão modular, com a pasta src/auth/ contendo controllers, modules, services, DTOs e outros arquivos relacionados ao JWT, seguindo conceitos do padrão MVC (Model-View-Controller) e da arquitetura em camadas.

No frontend, organizei o código seguindo uma arquitetura baseada em pastas funcionais: services, pages, context e components. Para o gerenciamento de estado, usei o próprio useContext do React, pela familiaridade e simplicidade dessa abordagem, que se encaixa no padrão de context API do React.

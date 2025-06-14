# Projeto Conécta - Sistema de Gerenciamento de Usuários

## Descrição

Sistema de gerenciamento de usuários desenvolvido com NestJS (backend) e ReactJS (frontend), utilizando TypeScript. O sistema oferece autenticação segura, gerenciamento de usuários e uma interface intuitiva.

## Objetivo

Desenvolver uma aplicação com NestJS (backend) e ReactJS (frontend), ambos utilizando TypeScript, para gerenciar informações de usuários. O sistema deve ser robusto, seguro e fácil de usar, proporcionando uma experiência fluida tanto para administradores quanto para usuários regulares.

## Entregáveis

### 1. Código Fonte

- Link dos repositórios Git contendo os códigos do backend e frontend
- Instruções claras no README.md para configurar e executar a aplicação

### 2. Documentação

- Documentação da API (Swagger)
- Explicação das decisões de design e arquitetura

### 3. Demonstração

- Diferencial: Link para uma demonstração ao vivo (ex.: deploy no Heroku, Vercel ou Netlify) com usuário e senha de acesso

## Descrição do Sistema

### 1. Gerenciamento de Usuários

- Cadastrar novos usuários
- Autenticar usuários com login seguro
- Listar, editar e excluir informações de usuários (com permissões específicas para administradores)

### 2. Interface Amigável

- Tela de login para acessar o sistema
- Tela de cadastro para novos usuários
- Tela de listagem de usuários (para administradores) ou perfil do usuário (para usuários regulares)

## Requisitos Técnicos

### Backend (NestJS + TypeScript)

#### 1. Autenticação de Usuários

- Rotas para registro (/auth/register) e login (/auth/login)
- JWT para autenticação
- Diferencial: Integração com provedores de login (Google/Microsoft)

#### 2. Gerenciamento de Usuários

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  createdAt: Date;
  updatedAt: Date;
}
```

#### 3. Operações CRUD

- CRUD completo de usuários
- Permissões baseadas em roles
- Filtros e ordenação
- Endpoint para usuários inativos

#### 4. Testes

- Testes unitários e de integração

### Frontend (ReactJS + TypeScript)

#### 1. Telas

- Login
- Cadastro
- Listagem de Usuários (Admin)
- Perfil do Usuário

#### 2. Funcionalidades

- Autenticação
- Gerenciamento de estado
- Interface responsiva
- Integração com backend

## Tecnologias Utilizadas

### Backend

- Framework: NestJS com TypeScript
- Banco de Dados: PostgreSQL
- ORM: TypeORM
- Autenticação: JWT
- Documentação: Swagger
- Docker: para containerização
- Jest: para testes

### Frontend

- Framework: ReactJS com TypeScript
- Estado Global: Context API
- Rotas: React Router
- Estilização: TailwindCSS
- HTTP Client: Axios
- Vite: para desenvolvimento

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

2. Configure as variáveis de ambiente:

```bash
cp backend/.env.example backend/.env
```

3. Inicie os containers:

```bash
docker-compose up -d
```

### Configuração Manual

1. Backend:

```bash
cd backend
npm install
npm run start:dev
```

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

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

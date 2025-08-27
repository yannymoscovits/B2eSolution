# B2eSolution — API .NET 8 + React (Vite)

Aplicação **Full Stack** composta por:
- **Back-end:** ASP.NET Core 8 + EF Core (arquitetura em camadas inspirada em **Clean Architecture**).
- **Front-end:** React + Vite + TypeScript.
- **Banco:** SQL Server LocalDB (modo Dev), com **migrations**.

Recursos: **autenticação JWT**, senhas com **BCrypt**, **CRUD de produtos** com **paginação/ordenação** e **exportação Excel** da **lista completa**.

---

## Estrutura do Repositório

```
/
├─ B2eSolution.Api/        # API .NET 8 (todas as camadas em pastas)
│  ├─ Application/            # Casos de uso, DTOs, validações
│  ├─ Controllers/            # Endpoints REST
│  ├─ Domain/
│  │  └─ Entities/            # Entidades (Usuario, Produto, etc.)
│  ├─ Infraestructure/        # EF Core, Repositórios, Context, Configs
│  ├─ Migrations/             # Histórico de migrations
│  ├─ appsettings.json        # Connection strings, JWT, CORS, etc.
│  └─ Program.cs              # Bootstrap da API
│
└─ b2esolution.client/        # Front-end React + Vite + TS
   ├─ src/
   │  ├─ api/                 # Funções de request (fetch)
   │  ├─ components/          # UI e modais
   │  ├─ pages/               # Login, Produtos
   │  └─ types.ts             # Tipagens (DTOs/ViewModels)
   └─ vite.config.ts
```

> Observação: este projeto segue **Clean Architecture “lite”** (por pastas). A separação de responsabilidades está mantida, mas **num único projeto .NET** para simplificar o setup.

---

## Pré-requisitos

- **.NET SDK 8.0+**
- **Node.js 18+ (LTS)**
- **SQL Server LocalDB** (ou instância SQL de sua preferência)

---

## Configuração (API)

### 1) Connection String (SQL Server)
Abra `B2eSolution.Server/appsettings.json`:

```json
{
  "ConnectionStrings": {
    // Para LocalDB (desenvolvimento rápido, sem senha)
    //"DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=B2eDb;Trusted_Connection=True;MultipleActiveResultSets=true",

    // Exemplo para SQL Server com usuário/senha - Conecte aqui seu Banco de Dados
    "DefaultConnection": "Server=localhost,1433;Database=B2eDb;User Id=sa;Password=SuaSenha123;TrustServerCertificate=True;MultipleActiveResultSets=true"
  },

  "Jwt": {
    "Key": "mysupersecret_superlong_secure_key_2025!",
    "Issuer": "B2eSolution",
    "Audience": "B2eSolutionClient"
  },

  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}

```

- **Trocar servidor/banco:** ajuste `Server` / `Database` / `User Id`/ `Password`.
<img width="1197" height="138" alt="image" src="https://github.com/user-attachments/assets/f146b4b6-9b25-4a37-90e8-73071355f5d5" />

- **JWT:** substitua `Jwt:Key` por uma chave forte (mín. 32 chars).
<img width="479" height="107" alt="image" src="https://github.com/user-attachments/assets/18b38112-c512-4ee5-961e-342b7727f9dd" />
![Uploading image.png…]()

- **CORS:** confirme a origem do front (`5173` via Vite).
<img width="705" height="248" alt="image" src="https://github.com/user-attachments/assets/c4a63060-47a0-4dcc-885f-195de2caa28a" />

### 2) Criar/Atualizar o Banco (EF Core)
Rode as migrations apontando para a API:

```bash
cd B2eSolution.Api
dotnet restore
dotnet ef database update
```
---

## ▶️ Como Rodar

### API
```bash
cd B2eSolution.Server
dotnet run
```
- **URL** (exemplo): `https://localhost:44341`  
- Endpoints sob `/api/*`

### Front-end
```bash
cd b2esolution.client
npm install
npm run dev
```
- **URL:** `http://localhost:5173`

#### Base da API no Front
No front você pode usar:
- `.env` em `b2esolution.client/`:
  ```
  VITE_API_BASE=https://localhost:44341/api
  ```
- E no código (ex.: `src/api/index.ts`):
  ```ts
  const BASE = import.meta.env.VITE_API_BASE ?? 'https://localhost:44341/api';
  ```
---
## Autenticação (JWT)
- **Login:** `POST /api/auth/login`  
  **Body:** `{ "login": "usuario", "senha": "senha" }`  
  **Retorno:** `{ "token": "<jwt>" }`
- Use o token em todas as rotas protegidas:
  ```
  Authorization: Bearer <jwt> (com tempo de expiração)
  ```

**Senha com BCrypt**: no cadastro de usuário a senha é **hasheada** (nunca em texto puro).  
<img width="667" height="158" alt="image" src="https://github.com/user-attachments/assets/b33e7ed4-da6c-4962-9ef0-3dca76f45534" />

---

## Endpoints Principais

### Produtos
- `GET /api/produtos/ListProduto` (Listar)  
- `POST /api/produtos/AddProduto`  (Adicionar)
- `PUT /api/produtos/UpdateProduto{id}`  (Editar)
- `DELETE /api/produtos/DeleteProduto/{id}`  (Deletar)

### Usuários / Auth
- `POST /api/auth/login`  
- `POST /api/Addusuarios` 

<img width="1417" height="695" alt="image" src="https://github.com/user-attachments/assets/7c214223-c041-47f6-8665-548c5543e4f0" />

---

## Front-end

- **Login** integrado à API (JWT).  
- **Lista de Produtos** com paginação, ordenação por Nome (front-end), exportação Excel.  
- **Modal de Edição** com valores preenchidos.
- **Adição de Produtos.

<img width="1903" height="976" alt="image" src="https://github.com/user-attachments/assets/3bd3ec69-0848-4589-970e-b3531384513e" />
<img width="1876" height="944" alt="image" src="https://github.com/user-attachments/assets/7a9552ef-7a23-40eb-9f88-c996923112aa" />

---

## Arquitetura & Decisões Técnicas

- **Clean Architecture (por pastas)**  
- **Entity Framework Core (Code-First)**  
- **JWT** para autenticação stateless  
- **BCrypt** para segurança de senhas  
- **React + Vite + TypeScript**  
- **Por que Vite?**  
  - Hot reload quase instantâneo (ESBuild)  
  - Build otimizado com Rollup  
  - Configuração simples (vite.config.ts)  
  - Suporte nativo a TS/JSX/PostCSS  
  - Melhor DX comparado ao CRA  
---

## Troubleshooting
- **Login inválido:** Verifique body `{ login, senha }`.  
- **Bearer ausente:** Responses 401/403.  
- **CORS bloqueando:** ajuste `Cors:AllowedOrigins`.  
- **PendingModelChangesWarning:** gere migration nova e rode `dotnet ef database update`.  

---

## Autor
**Yanny Dorea Moscovits** — Full Stack .NET  
LinkedIn: [link aqui]

# IFast

Site web *mobile-first* de caronas para alunos e servidores do IFNMG. Nele é possível **pedir** e **ofertar** caronas.

## Stack

| Camada | Tecnologias |
| :-- | :-- |
| Front-end | React, Vite, TypeScript, Tailwind CSS, React Router, React Hook Form + Zod, Axios, Tanstack Query, Zustand |
| Back-end | Java, Spring Boot, Hibernate, JWT |
| Banco de dados | MySQL 8 |
| Autenticação | E-mail/senha e Google OAuth |

## Estrutura do repositório

```
IFast/
├── frontend/   # Aplicação React (Vite)
└── backend/    # API REST (Spring Boot)
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20+ e npm
- [JDK](https://adoptium.net/) 17+ (use a versão definida no `pom.xml`/`build.gradle`)
- [MySQL](https://dev.mysql.com/downloads/) 8
- Um **Client ID do Google OAuth** (veja a seção [Google OAuth](#google-oauth))

## Como rodar

Suba primeiro o banco e o back-end, depois o front-end.

### 1. Banco de dados

Crie o schema no MySQL:

```sql
CREATE DATABASE ifast_db;
```

> As tabelas são criadas automaticamente pelo Hibernate ao iniciar a API.

### 2. Back-end

```bash
cd backend
```

1. Crie o arquivo `.env` com base no modelo abaixo.
```dotenv
DB_URL=jdbc:mysql://localhost:3306/ifast_db
DB_USERNAME=
DB_PASSWORD=
GOOGLE_CLIENT_ID=
JWT_SECRET=
```

2. Rode o arquivo Application.java
```java
package backend;

@EnableJpaAuditing 
@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

}
```

A API ficará disponível em `http://localhost:8080`.

| Variável | Descrição |
| :-- | :-- |
| `DB_URL` | URL JDBC de conexão com o MySQL |
| `DB_USERNAME` | Usuário do banco |
| `DB_PASSWORD` | Senha do banco |
| `GOOGLE_CLIENT_ID` | Client ID do Google OAuth (o mesmo usado no front) |
| `JWT_SECRET` | Chave secreta usada para assinar os tokens JWT. Use uma string longa e aleatória |

### 3. Front-end

```bash
cd frontend
npm install
```

1. Crie o arquivo `.env` com base no modelo abaixo.
```dotenv
VITE_API_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O front ficará disponível em `http://localhost:5173`.

| Variável | Descrição |
| :-- | :-- |
| `VITE_API_URL` | URL base da API do back-end |
| `VITE_GOOGLE_CLIENT_ID` | Client ID do Google OAuth (o mesmo usado no back) |

## Google OAuth

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/) e crie um projeto.
2. Em **APIs e serviços → Credenciais**, crie um **ID do cliente OAuth** do tipo *Aplicativo da Web*.
3. Em **Origens JavaScript autorizadas**, adicione `http://localhost:5173`.
4. Copie o Client ID gerado para `VITE_GOOGLE_CLIENT_ID` (front) e `GOOGLE_CLIENT_ID` (back).

## Convenções

- Nomenclatura do código em **inglês**.
- Textos da interface em **português**.

## Equipe

Ana Clara e Pedro Inácio
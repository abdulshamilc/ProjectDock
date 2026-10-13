# Project Management System

A full-stack Project Management System built with the MERN stack (MongoDB, Express, React, Node.js) and Claude AI integration.

## Prerequisites

- **Node.js 20+** — [download](https://nodejs.org/)
- **Local MongoDB** running at `mongodb://127.0.0.1:27017` — [install guide](https://www.mongodb.com/docs/manual/installation/)

## Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd project-management

# 2. Install all dependencies (root, server, client)
npm install

# 3. Create the server .env from the example
cp server/.env.example server/.env
# Edit server/.env if your MongoDB URI or port differs

# 4. Start both server and client in development mode
npm run dev
```

The server runs on **http://localhost:5000** and the client on **http://localhost:5173**.
The client proxies `/api` requests to the server automatically.

## Scripts

| Command                   | Description                                |
| ------------------------- | ------------------------------------------ |
| `npm run dev`             | Start server + client concurrently         |
| `npm run dev -w server`   | Start server only (with `--watch`)         |
| `npm run dev -w client`   | Start client only (Vite dev server)        |
| `npm run lint`            | Lint server and client                     |
| `npm run format`          | Format all files with Prettier             |
| `npm run format:check`    | Check formatting without changing files    |
| `npm test`                | Run server tests (Node.js built-in runner) |
| `npm run build -w client` | Build client for production                |

## Git Workflow

- **`main`** — production-ready code; protected branch (require PR reviews)
- **`develop`** — integration branch; features merge here first
- Feature branches: `feature/<name>` from `develop`
- Hotfix branches: `hotfix/<name>` from `main`

## Architecture

This project follows a **feature-based modular monolith** architecture. Business logic is isolated from the framework (Express) and the database (Mongoose).

### The Four Layers

Every server module (`server/src/modules/<feature>/`) has four layers:

1. **Domain** (`domain/`) — Pure business rules. Plain functions and constants. Imports **nothing** from Express, Mongoose, or other modules.

2. **Service** (`<feature>.service.js`) — Use cases. Built with a factory that receives its dependencies (repository, event bus, clock, etc.). No Express, no Mongoose, no `req`/`res`.

3. **Repository** (`<feature>.repository.js`) — Data access. The **only** file that uses the Mongoose model. Always returns plain objects (`.lean()`), never Mongoose documents.

4. **Controller + Routes** (`<feature>.controller.js`, `<feature>.routes.js`) — HTTP only. Parse the request, call the service, send the response. Never import models or repositories.

### Import Rules

- **Domain** may only import from its own `domain/` folder
- **Services** may not import `mongoose`, `express`, `*.model.js`, or `*.repository.js`
- **Controllers** may not import `*.model.js` or `*.repository.js`
- **Cross-module** imports go through `index.js` only — never internal files
- These rules are **enforced by ESLint** — the build fails on violation

### How to Add a New Module

1. Create `server/src/modules/<feature>/`
2. Add `domain/` with pure business functions
3. Add `<feature>.model.js` (Mongoose schema, if needed)
4. Add `<feature>.repository.js` (data access, returns plain objects)
5. Add `<feature>.service.js` (factory: `createXService({ repo, events })`)
6. Add `<feature>.controller.js` (HTTP only, calls the service)
7. Add `<feature>.routes.js` (Express router)
8. Add `<feature>.validation.js` (request validation)
9. Add `index.js` exporting the public API
10. Wire everything in `src/container.js`
11. Mount the router in `src/app.js` under `/api/v1/<feature>`
12. Add tests: domain unit tests, service tests with fakes, HTTP tests

See `docs/ARCHITECTURE.md` for the full architecture reference.

## API

All endpoints are under `/api/v1`.

| Method | Path             | Description         |
| ------ | ---------------- | ------------------- |
| GET    | `/api/v1/health` | System health check |

## License

Private — all rights reserved.

# Architecture

## Planned Modules

Each module owns its own data and exposes a public API via `index.js`.

| Module            | Data Owned                                             | Notes                                      |
| ----------------- | ------------------------------------------------------ | ------------------------------------------ |
| **auth**          | Sessions, refresh tokens                               | JWT + refresh tokens in MongoDB TTL index  |
| **users**         | User profiles, password hashes, roles                  | Roles: CEO, Head, Lead, Member, Security   |
| **teams**         | Team membership, team metadata                         | Links users to projects                    |
| **projects**      | Project metadata, status, settings                     | CEO creates, assigns Heads                 |
| **workPackages**  | Work package definitions, assignments                  | AI suggests, CEO assigns to Heads          |
| **tasks**         | Task definitions, status, Kanban board state           | Leads split work packages; Members execute |
| **ai**            | Prompt/response logs, usage metrics                    | Claude API integration                     |
| **notifications** | Notification records, read state, delivery preferences | In-app + email                             |
| **reports**       | Generated report snapshots                             | Role-based dashboards                      |
| **health**        | _(none — reads DB connection state)_                   | Reference module, already implemented      |

> **Naming rule**: In the business domain, "module" means a work package. In code, always use `workPackage` or `component` so it is never confused with an architecture module (a folder under `src/modules/`).

---

## The Four Layers

Every module in `server/src/modules/<feature>/` follows the same layered structure:

```
<feature>/
├── domain/              ← Pure business rules
│   └── *.js             ← Plain functions & constants. ZERO external imports.
├── <feature>.service.js ← Use cases (factory with injected deps)
├── <feature>.repository.js ← Data access (Mongoose). Returns plain objects.
├── <feature>.model.js   ← Mongoose schema (only if needed)
├── <feature>.controller.js ← HTTP: parse req → call service → send res
├── <feature>.routes.js  ← Express router definitions
├── <feature>.validation.js ← Request validation rules
└── index.js             ← PUBLIC API (the ONLY importable entry point)
```

### Layer Rules

| Layer          | May Import                              | Must NOT Import                                     |
| -------------- | --------------------------------------- | --------------------------------------------------- |
| **Domain**     | Only files in the same `domain/` folder | mongoose, express, other modules, anything external |
| **Service**    | Own `domain/`, injected dependencies    | mongoose, express, `*.model.js`, `*.repository.js`  |
| **Repository** | mongoose, own `*.model.js`              | express, other modules' models                      |
| **Controller** | Own service (injected)                  | mongoose, `*.model.js`, `*.repository.js`           |
| **Routes**     | express Router, own controller          | models, repositories                                |

Services are built with a factory pattern that receives dependencies:

```js
export function createXService({ repo, events, clock }) { ... }
```

This makes every service testable with fakes — no real DB or framework required.

---

## Communication Rules

1. **Service calls via `index.js`**: Module A calls Module B's exported service through B's `index.js`. Never import another module's internal files.

2. **Events for reactions**: When something happens in Module A that Module B cares about, A emits an event through the shared event bus. B subscribes. Neither knows about the other's internals.

3. **IDs only across modules**: Store foreign references as plain IDs (e.g. `projectId: ObjectId`). Never store copies of another module's objects or embed their sub-documents.

---

## Composition Root

All wiring happens in `src/container.js`:

- Creates repositories, services, controllers, routers
- Injects dependencies (repos, event bus, ports)
- `app.js` mounts the routers under `/api/v1`

This keeps modules unaware of each other's creation details.

---

## Ports (External Dependencies)

External dependencies sit behind **ports** (interfaces) injected into services. This isolates business logic from infrastructure.

| Port         | Purpose                      | Planned Implementation     |
| ------------ | ---------------------------- | -------------------------- |
| `aiClient`   | AI text generation           | Claude API (Anthropic SDK) |
| `tokenStore` | Token persistence & expiry   | MongoDB TTL index          |
| `mailer`     | Email sending                | Nodemailer                 |
| `jobQueue`   | Scheduled/recurring jobs     | node-cron                  |
| `realtime`   | WebSocket push notifications | Socket.io                  |

None are implemented yet. When needed, they will be created as adapters that satisfy the port interface and injected via the container.

---

## Permission Approach

- **Role checks** (e.g. "is user a Head?") → Express route middleware. Runs before the controller.
- **Scope checks** (e.g. "can this Head touch _this specific_ project?") → Pure functions in `domain/` or `service` layer. Testable without a running server.
- Roles: `CEO`, `Head`, `Lead`, `Member`, `Security`

---

## Error Handling

- Business errors extend `AppError` with `status` and `code` properties
- Services throw domain errors (`NotFoundError`, `ValidationError`, `ConflictError`, `ForbiddenError`)
- Services NEVER reference HTTP status codes directly
- The central error handler (`shared/middleware/errorHandler.js`) maps errors to JSON responses

---

## API Convention

- All routes under `/api/v1`
- JSON request/response
- Standard error shape: `{ "message": "...", "code": "..." }`

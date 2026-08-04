# Node.js Intern Learning Roadmap

A self-paced research and skills checklist. Tick each box as you understand the concept — and where a "Practice" note is given, try to actually build the small thing, not just read about it.

---

## 1. Git & GitHub Workflows

- [ ] Branching strategies (`main`, `feature/*`, `bugfix/*`)
- [ ] Creating clean Pull Requests (PRs) and conducting code reviews
- [ ] Resolving merge conflicts manually
- [ ] Understanding rebase vs. merge
- [ ] `.gitignore` best practices and committing secrets by accident (and how to remove them from history)
- [ ] Writing good commit messages (conventional commits, atomic commits)

**Practice:** Create a feature branch, intentionally cause a merge conflict with `main`, and resolve it manually.

---

## 2. Database Fundamentals & SQL

- [ ] Core CRUD operations (`SELECT`, `INSERT`, `UPDATE`, `DELETE`)
- [ ] Query mechanics: Table joins (`INNER`, `LEFT`, `RIGHT`)
- [ ] Aggregate functions (`GROUP BY`, `HAVING`)
- [ ] Filtering (`WHERE`)
- [ ] Basic indexing: how database indexes work and why unindexed searches degrade performance
- [ ] Primary keys, foreign keys, and normalization basics (1NF/2NF/3NF at a conceptual level)
- [ ] Transactions (`BEGIN`, `COMMIT`, `ROLLBACK`) and why they matter

**Practice:** Write a raw SQL query with a `JOIN` and `GROUP BY`, then write the same query using an ORM.

---

## 3. Async JavaScript & The Event Loop

- [ ] Promises, `async/await`, and asynchronous error handling (`try/catch` and `.catch()`)
- [ ] Understanding the Event Loop: Call stack, Node API bindings, Microtask Queue (Promises), and Macrotask Queue (`setTimeout`, I/O)
- [ ] `Promise.all`, `Promise.allSettled`, `Promise.race`
- [ ] Callback hell and why async/await replaced it
- [ ] Unhandled promise rejections and uncaught exceptions — what happens to the process

**Practice:** Predict the output order of a script mixing `console.log`, `setTimeout`, and `Promise.resolve().then()` — then run it and check.

---

## 4. Express.js & Middleware Pattern

- [ ] Request-Response lifecycle (`req`, `res`, `next()`)
- [ ] Writing custom middleware (loggers, request body parsers, validation)
- [ ] Centralized error-handling middleware
- [ ] Logging (structured logging, log levels — info/warn/error)
- [ ] Router-level middleware and organizing routes into modules

**Practice:** Build a middleware that logs `method + path + status code + response time` for every request.

---

## 5. Database Integration & Security

- [ ] Interacting with SQL databases using Query Builders or ORMs (e.g., Prisma, Knex, or Drizzle)
- [ ] Preventing SQL Injection via parameterized queries / ORM abstractions
- [ ] Environment variable management (`.env`, `dotenv`) and CORS configuration
- [ ] Connection pooling basics (why you don't open a new DB connection per request)

**Practice:** Set up a `.env` file for DB credentials and confirm the app fails safely if a required variable is missing.

---

## 6. Authentication & Authorization

- [ ] Password hashing mechanisms (`bcrypt` or `argon2`)
- [ ] JSON Web Tokens (JWT): Creation, signing, verification, and bearer token header transmission
- [ ] Role-based route protection middleware
- [ ] Access tokens vs. refresh tokens, and token expiry handling
- [ ] Sessions vs. tokens — when to use which

**Practice:** Build a protected route that only responds if a valid JWT is passed in the `Authorization` header.

---

## 7. REST vs. WebSockets vs. SSE

- [ ] **REST API:** Stateless HTTP communication over GET, POST, PUT, PATCH, DELETE. Ideal for standard CRUD operations.
- [ ] **WebSockets:** Full-duplex, persistent real-time connection. Ideal for chat applications, live notifications, or collaborative tools.
- [ ] **Server-Sent Events (SSE):** One-way real-time streaming from server to client over standard HTTP. Ideal for news feeds or live status dashboards.
- [ ] When to pick REST vs. WebSockets vs. SSE for a given feature (decision-making, not just definitions)

---

## 8. Microservices vs. Monoliths (Conceptual)

- [ ] Differences between monolithic codebases and microservice architectures
- [ ] Basic understanding of inter-service communication (REST, gRPC, Message Queues)
- [ ] Trade-offs: when a monolith is the _right_ choice, not just the "legacy" choice

---

## 9. Monorepo Architecture (Conceptual)

- [ ] Understanding code management tools (npm workspaces, Nx, Turborepo) for sharing code across multiple services or applications within a single repository

---

## 10. HTTP Fundamentals

- [ ] Status codes and what they actually mean (2xx success, 3xx redirect, 4xx client error, 5xx server error — not just "200 = good")
- [ ] Common headers (`Content-Type`, `Authorization`, `Cache-Control`)
- [ ] Statelessness and idempotency (why `PUT` should be idempotent but `POST` shouldn't be assumed to be)

---

## 11. Input Validation & Error Handling Patterns

- [ ] Schema validation with Zod or Joi
- [ ] Custom Error classes and consistent error response shapes
- [ ] Operational errors (bad input, expected failures) vs. programmer errors (bugs)
- [ ] Graceful handling of uncaught exceptions and unhandled rejections at the process level

**Practice:** Add request-body validation to an existing route and return a consistent `400` error shape on failure.

---

## 12. Security Beyond Auth

- [ ] `helmet.js` and secure HTTP headers
- [ ] Basic rate limiting (`express-rate-limit`)
- [ ] XSS and CSRF — what they are, at a conceptual level
- [ ] OWASP Top 10 — skim it once, know the names

---

## 13. Node.js Internals

- [ ] CommonJS vs. ES Modules (`require` vs. `import`)
- [ ] Streams and buffers — why they matter for large files/data
- [ ] `process.env`, `process.argv`, and process lifecycle events
- [ ] What clustering / worker threads solve (conceptual — not required to implement)

---

## 14. Package & Dependency Hygiene

- [ ] Semantic versioning (`^`, `~`, exact pins)
- [ ] `package-lock.json` — what it's for and why you don't ignore it
- [ ] `dependencies` vs. `devDependencies`
- [ ] `npm audit` and handling vulnerable dependencies

---

## 15. API Design Conventions

- [ ] API versioning strategies (`/v1/`, header-based)
- [ ] Pagination (offset vs. cursor-based)
- [ ] Filtering and sorting via query parameters
- [ ] Consistent response envelope (e.g., `{ data, error, meta }`)

---

## 16. Testing

- [ ] Unit testing basics (Jest or Vitest)
- [ ] Integration testing an Express route with Supertest
- [ ] Mocking dependencies (DB calls, external APIs)
- [ ] The habit of writing/updating a test alongside a feature, not after

**Practice:** Write one unit test and one integration test for a single existing route.

---

## 17. Debugging Tools

- [ ] Node inspector / Chrome DevTools for debugging a running Node process
- [ ] Using the `debugger` statement and breakpoints
- [ ] Reading and interpreting a stack trace confidently

---

## 18. Deployment Basics

- [ ] Process managers (PM2 or similar) — why you don't run `node server.js` directly in prod
- [ ] Dev / staging / prod config differences
- [ ] Light Docker exposure — enough to run `docker-compose up` for a local Postgres/Redis instance

---

## 19. API Documentation & Tooling

- [ ] Using Postman / Insomnia / Thunder Client to manually test endpoints
- [ ] Awareness of OpenAPI/Swagger for documenting APIs

---

### How to use this checklist

Go section by section, not necessarily top to bottom — pair each concept with its "Practice" note where given. The goal isn't to memorize definitions, it's to be able to explain _why_ each thing exists and _when_ you'd reach for it.

# Task board

This is a React + TypeScript frontend in a pnpm/Turborepo workspace. The
implementation is underway; this README will be completed as the features and
their trade-offs are established.

## Workspace boundaries

- `apps/web` owns the Vite application and composes the feature packages.
- `packages/users` and `packages/todos` own their respective feature code and
  must not depend on each other.
- `packages/core` contains shared infrastructure used by both features,
  including the TanStack Query client and the Tailwind theme (`primary:
  #0A1B45`).
- The pnpm catalog keeps React, React DOM, their type packages, and
  `@tanstack/react-query` versions aligned across the workspace. The web app
  provides the runtime dependencies; core and feature packages declare Query as
  a peer.

## Local development

Requires Node.js `^20.19.0` or `>=22.12.0` and pnpm 10.

```bash
cd senior-frontend-engineer
pnpm install
pnpm dev:web
```

Open the local URL printed by Vite. Run `pnpm build` for a production build and
`pnpm lint` for TypeScript checks.

## Data layer

`@internal/core` provides the shared in-memory fake backend, including 300 ms
latency, session-scoped data, and one-shot failure injection through
`fakeBackend.failNext(...)`. The `users` and `todos` packages expose their own
feature-facing API functions and use that same backend.

## Decisions to finalize

As implementation progresses, document the optimistic ToDoItem mutation and
rollback, selected-user state, performance considerations, and production
testing strategy here.

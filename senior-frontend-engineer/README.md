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
- TanStack Router and its Vite plugin are declared directly in `apps/web`
  because only that app uses them.

## Local development

Requires Node.js `^20.19.0` or `>=22.12.0` and pnpm 10.

```bash
cd senior-frontend-engineer
pnpm install
pnpm dev:web
```

Open the local URL printed by Vite. Run `pnpm build` for a production build and
`pnpm lint` for TypeScript checks.

## Routes

Routes are file-based in `apps/web/src/routes`; the TanStack Router Vite plugin
generates `apps/web/src/routeTree.gen.ts` from these route modules:

- `index.tsx` maps `/` to an empty placeholder.
- `users/route.tsx` provides the shared parent route for user pages.
- `users/index.tsx` maps to `/users` and renders the user list.
- `users/new.tsx` maps to `/users/new` and renders the create form.
- `users/$userId.tsx` maps to `/users/:id` and renders the user detail.
- `todos.tsx` maps to `/todos`.

The user feature is implemented in `packages/users`; web route modules own
navigation while the package exports its query hooks and presentation
components. User creation requires a username and email; Zod validates the
fields, and the fake backend rejects duplicate email addresses
case-insensitively. The home and ToDoItem routes remain placeholders for their
later steps.

## Data layer

`@internal/core` provides the shared in-memory fake backend, including 300 ms
latency, session-scoped data, and one-shot failure injection through
`fakeBackend.failNext(...)`. The `users` and `todos` packages expose their own
feature-facing API functions and use that same backend. The user list starts
with Alice, Bob, and Charlie as demonstration data, each with a unique email.

## Next implementation steps

Add the ToDoItem feature and its optimistic rollback behavior, implement
Jotai-backed toast notifications, add focused tests, and document performance
and production testing.

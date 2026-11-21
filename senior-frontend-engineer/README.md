# Task board

This is a React + TypeScript frontend in a pnpm/Turborepo workspace. The
implementation is underway; this README will be completed as the features and
their trade-offs are established.

## Workspace boundaries

- `apps/web` owns the Vite application and composes the feature packages.
- `packages/users` and `packages/todos` own their respective feature code and
  must not depend on each other.
- `packages/core` is the shared platform package: it contains the fake backend,
  TanStack Query client, Tailwind theme (`primary: #0A1B45`), and reusable
  notification infrastructure.
- The pnpm catalog keeps React, React DOM, their type packages,
  `@tanstack/react-query`, and Jotai versions aligned. Core and feature
  packages declare React/Query as peers where needed.
- `apps/web` mounts the core notifications provider at the app root. Its routes
  bridge feature mutation callbacks to the shared notification API without coupling
  feature packages to each other.
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

- The web app root renders a shared header on every route with Users and Todo
  Items links.
- `index.tsx` maps `/` to a simple Task Board home page.
- `users/route.tsx` provides the shared parent route for user pages.
- `users/index.tsx` maps to `/users` and renders the user list.
- `users/new.tsx` maps to `/users/new` and renders the create form.
- `users/$userId.tsx` maps to `/users/:id` and renders the user detail.
- `todos.tsx` maps to `/todos`, where users can select an assignee, create
  ToDoItems, and view that assignee's list.

The user feature is implemented in `packages/users`; web route modules own
navigation while the package exports its query hooks and presentation
components. User creation requires a username and email; Zod validates the
fields, and the fake backend rejects duplicate email addresses
case-insensitively. The home route remains a placeholder.

## Data layer

`@internal/core` provides the shared in-memory fake backend, including 300 ms
latency, session-scoped data, and one-shot failure injection through
`fakeBackend.failNext(...)`. The `users` and `todos` packages expose their own
feature-facing API functions and use that same backend. The user list starts
with Alice, Bob, and Charlie as demonstration data, each with a unique email.
ToDoItem creation uses an optimistic, per-assignee cache update with rollback
on failure; Zod validates non-empty titles up to 120 characters.
User and ToDoItem mutations show dismissible success/error notifications from
the core-provided app-root viewport. Notifications expire after 3 seconds;
server data remains in TanStack Query.

## Next implementation steps

Finish the remaining app polish, add focused tests, and document performance
and production testing.

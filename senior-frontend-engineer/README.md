# Task Board

Task Board is a small React and TypeScript app for creating users and assigning
ToDoItems to them. It uses an in-memory fake API, so no server or account is
needed.

## Run locally

Requires Node.js 22.12 or newer, and pnpm 10. From the repository root:

```bash
cd senior-frontend-engineer
pnpm install
pnpm dev:web
```

Open the local URL printed by Vite. Run `pnpm build` to build the app and
`pnpm lint` to type-check the workspace.

## How it is organized

- `apps/web` owns the app shell, shared navigation, and file-based TanStack
  Router routes, including `/users`, `/users/new`, `/users/:id`, and
  `/todos`.
- `packages/users` and `packages/todos` each own their feature's components,
  hooks, validation, and API calls. They both use `packages/core` and do not
  depend on each other. This keeps the features easier to change or reuse.
- `packages/core` holds shared infrastructure: the fake backend, TanStack
  Query setup, theme, and notification UI.

TanStack Query manages user and ToDoItem data. ToDoItem lists have a separate
cache entry per user; creating an item updates the selected user's list
immediately and restores it if the request fails. Zod validates form input.
Jotai holds only temporary notification state, not server data.

The fake API adds a short delay, starts with three sample users, and can inject
failures for the UI to handle. Its data is in memory, so it is not a substitute
for a persistent backend.

## Performance and testing

Per-user query keys keep list updates scoped to the selected user, and the
optimistic update avoids waiting for the fake request to finish.

There is no automated test suite yet (see step 9 in [`ai-journey/plan.md`](./ai-journey/plan.md))

See [`ai-journey/`](./ai-journey/) for the plan and notes on the AI-assisted
workflow.

# AI Journey

## Key prompt

> I'm currently working in `/senior-frontend-engineer`.
> Starting point: `/senior-frontend-engineer/instructions.md`.
>
> There are two tasks in that file. What to do:
>
> 1. Read the instructions fully and summarize each task in your own words.
> 2. List any ambiguities or assumptions. Ask me before proceeding if something is unclear.
> 3. Write a step-by-step plan. For each step include:
>    - what you'll do and why (justification)
>    - how to verify it (test, command, or manual check)
> 4. Stop and wait for my approval before finishing each step.
> 5. After each task is done, append an entry to `/senior-frontend-engineer/ai-journey.md`
>    with: what was done, key decisions and why, problems hit, and what you'd
>    do differently.

## Follow-through plan

The implementation should follow [plan.md](./plan.md), which separates the user
and ToDoItem features, uses shared infrastructure, and makes optimistic rollback
the main behavioral checkpoint.

## Toolchain

- **AI assistant:** Copilot SDK in VS Code.
- **Skills:** none loaded.
- **External models:** not selected or exposed directly in this session.

## Judgment and overrides

- Used the repository snapshot and instruction files as the source of truth.
- Preferred a bounded implementation plan over scaffolding immediately, because
  package boundaries and the optimistic mutation behavior need to guide all later
  choices.
- Did not implement the app in this planning pass; the next pass should start
  with workspace scaffolding and shared infrastructure.

## Implementation key prompts

### Step 2 — shared Query, styling, and dependency versions

> - Configure a pnpm catalog with one version for TanStack Query, React,
>   React DOM, and both React type packages. Use catalog references in the
>   workspace so the apps and packages stay aligned.
> - Keep the web app as the owner of the runtime React, React DOM, and Query
>   dependencies. Declare Query as a peer and development dependency in core
>   and both feature packages to avoid duplicate Query instances.
> - Create a shared QueryClient in core and provide it once at the web app
>   root.

The initial setup declared separate versions for TanStack Query, React, and React DOM,
which could lead to version conflict across packages. I asked for a shared pnpm catalog,
including the React type packages, to keep those versions aligned.

### Step 3 — in-memory data access client

> - Add a shared in-memory backend in `packages/core`. Give it a default delay
>   of 300 ms, allow custom delays, and support a one-time injected failure for
>   a chosen operation.
> - Name the shared exports `fakeBackend` and `createFakeBackend`.
> - Let `packages/users` expose `createUser` and `getUser`
> - Let `packages/todos` expose `createToDoItem` and `listToDoItemsByUser`.
> - Both packages must use the same backend and must not depend on each other.
> - Update the README and this AI journey record.

The initial implementation put the feature API functions in `core`.
I moved the user functions to `packages/users` and the ToDoItem functions to `packages/todos`,
then exposed them through each package's entry point for `apps/web` to use. The shared
fake backend stays in `core` so both features use the same in-memory data without depending on each other.

### Step 4 — router-first page routes

> - Wire TanStack Router into `apps/web` before building the feature pages.
> - Use file-based routing to create `/`, `/users`, `/users/new`,
>   `/users/$userId`, and `/todos`; leave every route as an empty placeholder.
> - Put all user-related route files in `apps/web/src/routes/users/` instead
>   of using flat filenames.
> - Do not hand-edit the generated route tree.

I decided to move all user-related route files into the `users` folder instead
of keeping them flat. This keeps related routes together and gives them a
shared layout.

I declared `@tanstack/react-router` and `@tanstack/router-plugin` directly in
`apps/web/package.json` instead of adding them to the shared pnpm catalog.
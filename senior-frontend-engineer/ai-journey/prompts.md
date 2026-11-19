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
> 4. Stop and wait for my approval before implementing.
> 5. After each task is done, append an entry to `/senior-frontend-engineer/ai-journey.md`
>    with: what was done, key decisions and why, problems hit, and what you'd
>    do differently.

## Follow-through plan

The implementation should follow [plan.md](./plan.md), which separates the user
and ToDoItem features, uses shared infrastructure, and makes optimistic rollback
the main behavioral checkpoint.

## Toolchain

- **AI assistant:** Copilot SDK in VS Code.
- **Repository tools:** built-in file view, glob, ripgrep, apply-patch, and git
  status tools.
- **MCP servers:** none used for this planning pass.
- **Skills:** none loaded.
- **External models:** not selected or exposed directly in this session.

## Judgment and overrides

- Used the repository snapshot and instruction files as the source of truth.
- Preferred a bounded implementation plan over scaffolding immediately, because
  package boundaries and the optimistic mutation behavior need to guide all later
  choices.
- Did not implement the app in this planning pass; the next pass should start
  with workspace scaffolding and shared infrastructure.
- No AI output was overridden yet because no implementation was generated.

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
which could lead to version conflict across packages. I asked for a shared pnpm catalog, including the React type packages, to keep those versions aligned.

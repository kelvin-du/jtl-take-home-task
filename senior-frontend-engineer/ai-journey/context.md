# Handoff Context

Updated: 2026-11-20

## Repository state

- Repository: `kelvin-du/jtl-take-home-task`
- Workspace: `senior-frontend-engineer/`
- Branch: `main`
- Steps 1–3 are committed with subjects matching their plan headings:
  `Scaffold and enforce workspace boundaries`, `Add shared infrastructure`,
  and `Implement the in-memory data access client`.
- The Step 2 commit includes its implementation prompt in
  `ai-journey/prompts.md`.
- Step 4 has not started. Wait for the user before beginning it.

## Step 3 implementation

- `packages/core/src/fake-backend.ts` implements the shared in-memory backend.
  It exports `createFakeBackend` and the shared `fakeBackend` instance.
- The backend stores users and ToDoItems in a private `FakeDb`, simulates
  300 ms latency by default, allows custom latency, and supports one-shot
  failure injection through `failNext`.
- It supports user creation and lookup, ToDoItem creation and listing by
  assignee, and rejects ToDoItems assigned to unknown users.
- `packages/users/src/api.ts` and `packages/todos/src/api.ts` expose
  feature-specific API functions that use the same backend. Their package
  entry points re-export those functions and types. The feature packages do
  not depend on each other.
- `README.md` now documents the backend. `ai-journey/prompts.md` contains the
  Step 2 and Step 3 implementation prompts and the Step 3 boundary decision.
- The app does not use these API functions yet; UI integration belongs to
  later feature steps.

## Step 3 commit contents

- Backend implementation and exports in `packages/core`.
- Feature-facing API modules and package exports in `packages/users` and
  `packages/todos`.
- README and AI journey updates, including this handoff file.

## Validation and review notes

- `pnpm build` and `pnpm lint` passed for the whole workspace.
- Runtime smoke checks passed for isolated backend instances, user creation
  and lookup, assignee-filtered ToDoItem lists, and injected mutation failures.
- The `fakeDb` initializer follows the repository's semicolon style.
- Automated test infrastructure is planned for Step 8; behavior was checked
  with an ad hoc smoke test.

## Working preferences and next action

- The user wants each plan step to be reviewable and revertable, with a clean
  commit per step. Stop after each step and wait for review before continuing.
- Resume by checking `git status` and this file. Step 3 is complete; do not
  begin Step 4 until the user asks.
- The plan is in `ai-journey/plan.md`; task requirements are in `instructions.md`.

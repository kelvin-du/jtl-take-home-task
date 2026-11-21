# Implementation Plan

## Analysis

This task is a small Turborepo monorepo with two connected feature areas:

1. **User feature:** create a user with a username and email, and view a user
   by ID.
2. **ToDoItem feature:** create a ToDoItem with a title and assignee ID, and list items for a selected user.

The shippable application will own routing, layout, and package composition. The
`users` and `todos` packages will be independent feature boundaries; neither will
import the other. Shared concerns such as the TanStack Query client, types,
utilities, Tailwind setup, or TypeScript configuration will live in the `core`
package. The chosen backend is an in-memory/API-fake client so no real server or
authentication is required.

The highest-risk behavior is optimistic ToDoItem creation. The implementation
must update the correct TanStack Query cache immediately, and roll back that exact
optimistic state if the mutation rejects. Loading, error, and empty states are
first-class acceptance criteria rather than happy-path details.

## Target structure

```text
senior-frontend-engineer/
  apps/web/
  packages/users/
  packages/todos/
  packages/core/
  ai-journey/
  README.md
```

Package dependencies should follow this direction:

- `apps/web` may depend on `users`, `todos`, and `core`.
- `users` may depend only on `core`.
- `todos` may depend only on `core`.
- `core` must not depend on feature packages.

## Step-by-step plan

### 1. Scaffold and enforce workspace boundaries

Create the Turborepo workspace, Vite React app, feature packages, core package,
and minimal build/lint/dev pipeline.

**Justification:** This establishes the structural requirement immediately and
prevents feature coupling from becoming an implementation shortcut.

**Testable acceptance:**
- `pnpm install` or the selected package manager completes.
- `pnpm build` builds the app and all packages.
- A dependency inspection or explicit package manifests confirms `users` and
  `todos` do not depend on each other.
- `pnpm dev` starts the web application.

### 2. Add shared infrastructure

Set up shared TypeScript configuration, Tailwind integration, a TanStack Query
client, and only genuinely reusable types/utilities.

**Justification:** Shared infrastructure belongs in `core`; feature-specific
models and services do not.

**Testable acceptance:**
- The app can render Tailwind styles.
- TanStack Query provider is initialized once at the application composition root.
- Shared exports are importable by both feature packages without circular
  package dependencies.

### 3. Implement the in-memory data access client

Add a small fake API that supports user create/get and ToDoItem create/list
operations. Include deterministic latency and an injectable failure mechanism.

**Justification:** This lets the app demonstrate real asynchronous loading,
error handling, and mutations without adding a backend outside task scope.

**Testable acceptance:**
- A created user can be retrieved by ID.
- A created ToDoItem appears only in the list for its assignee.
- A forced mutation failure is observable and produces a rejected mutation.
- Loading and error states can be exercised through the UI.

### 4. Wire TanStack Router into the web app and create page routes

Set up TanStack Router's Vite plugin and file-based route modules in
`apps/web/src/routes` before adding the feature pages. Establish `/`, `/users`,
`/users/new`, `/users/$userId`, and `/todos`. Keep route files in the web app
rather than in the feature packages. Each route starts with a placeholder page;
group the user routes under `routes/users/` with a shared layout. Defer feature
UI and data hooks to their feature steps.

**Justification:** Establishing and checking every page path first gives later
feature work a clear place to be mounted and keeps routing out of reusable
feature packages.

**Testable acceptance:**
- The web app renders through `RouterProvider`.
- The Vite plugin generates the route tree from the route files.
- `/`, `/users`, `/users/new`, `/users/:id`, and `/todos` each resolve to a
  placeholder page.
- Direct navigation to every route renders its placeholder without a 404.
- The user detail route recognizes its ID parameter without mounting the
  feature page yet.
- `/users/new` is the create-user route; `/users/$userId` is the detail route.
- The user route modules are organized under `routes/users/`, with a shared
  layout rendering nested pages through `<Outlet />`.
- No feature form, query hook, or ToDoItem UI is mounted in this step.

### 5. Build the user feature package

Separate the package into types, API/data hooks, presentation components, and
public exports. Add Zod validation for username and required email, enforce
case-insensitive email uniqueness in the fake backend, add the user detail page
component and user-list query, and connect the user experience to `/users`,
`/users/new`, and `/users/$userId`, replacing those route placeholders.

**Justification:** Keeping API calls and stateful hooks out of components makes
the feature reusable and testable, while the app owns route registration. Zod
provides consistent field validation, while the backend enforces email
uniqueness.

**Testable acceptance:**
- Blank or overlong usernames and blank or invalid emails show meaningful
  inline errors.
- Submitting a valid username and email creates a user and navigates to its
  detail page.
- Duplicate email addresses are rejected case-insensitively.
- Navigation to the new user's detail page does not reload the app.
- `/users` lists all users with their emails and links to their detail pages.
- The user detail page loads or refetches the requested ID.
- The user detail page displays the user's email.
- Unknown/invalid IDs show an error or not-found state instead of crashing.
- Labels and keyboard submit work for the create form.

### 6. Build the ToDoItem feature package

Separate types, API/data hooks, optimistic mutation logic, and presentation.
Include Zod title validation, let the app compose its user list into an
assignee selector, and replace the `/todos` placeholder with the ToDoItem
experience. Keep `packages/todos` independent of `packages/users`.

**Justification:** The mutation cache update is feature-specific and belongs
inside the ToDoItem package, with UI composition kept thin. Per-assignee query
keys isolate list data while the app provides user options without introducing
a dependency between feature packages.

**Testable acceptance:**
- Blank, whitespace-only, or overlong titles show validation errors.
- Valid creation immediately inserts an item into the selected user's list.
- On forced failure, the previous list is restored and an error is shown.
- On success, a temporary ID is replaced or reconciled with server data.
- Switching assignees shows only that user's ToDoItems.
- `/todos` allows viewing and creating ToDoItems for each user.

### 7. Add Jotai-backed notifications

Use Jotai to manage transient notification state in the core notifications
module and expose a provider, viewport, and `useNotification` hook. Mount the
provider at the web app root and show success/error notifications for user and
ToDoItem mutations. Keep server data in TanStack Query.

**Justification:** The repository uses `packages/core` as a shared platform
package for cross-cutting infrastructure and UI, so notifications are exposed
through its dedicated subpath rather than mixed into the data API. This gives
routes consistent feedback without duplicating server data or coupling feature
packages to each other.

**Testable acceptance:**
- Successful user and ToDoItem mutations show success notifications.
- Failed mutations show error notifications without swallowing the mutation
  error.
- Notifications can be dismissed manually and automatically disappear after
  3 seconds.
- Success and error notifications use appropriate live-region semantics, and
  the dismiss control is keyboard-accessible.
- Jotai stores only transient notification state, not users or ToDoItems.

### 8. Compose and polish the web app

Create a small navigation shell and consistent Tailwind layout. Keep route
components as composition layers that import feature public exports.

**Justification:** Clean composition makes module boundaries visible and keeps
feature packages independent.

**Testable acceptance:**
- Primary navigation is keyboard-operable.
- Loading, error, empty, and success states are visually distinct.
- Forms have associated labels and semantic submit controls.
- The app remains usable at a narrow viewport.

### 9. Add focused automated checks

Prefer targeted unit/component tests over broad coverage. Use Vitest and Testing
Library if scaffolded with the monorepo.

**Justification:** The 2–4 hour scope calls for proof of the most failure-prone
behaviors, especially optimistic updates and route/detail flows.

**Testable acceptance:**
- Optimistic ToDoItem creation inserts and rolls back correctly.
- User validation and successful creation are tested.
- Route params resolve the requested user.
- Shared package boundary rules are enforced through package manifests or lint,
  where practical.

### 10. Document decisions and produce final README

Write a half-page README covering architecture, package boundaries, backend
choice, optimistic updates, Jotai-backed notifications, validation
choice, trade-offs, install and run instructions, performance considerations,
and the production testing strategy.

**Justification:** The README is a primary evaluation artifact and explains
judgment as clearly as the code.

**Testable acceptance:**
- A fresh checkout has copy/paste install and run commands.
- All package boundaries and route locations are described accurately.
- Performance notes distinguish query caching, re-renders, and code splitting.
- Testing strategy lists test types and the highest-value cases.

## Validation order

1. Workspace install, lint, and build.
2. Direct navigation to `/`, `/users`, `/users/new`, `/users/:id`, and
   `/todos`, confirming each placeholder renders before feature UI is added.
3. User create/detail happy path, loading, unknown user, and validation states.
4. ToDoItem create/list happy path.
5. Forced ToDoItem failure and cache rollback.
6. Jotai success/error notifications and manual/automatic dismissal.
7. Keyboard and live-region accessibility review.

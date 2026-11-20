import { Link, createFileRoute } from "@tanstack/react-router";
import { UserList } from "@internal/users";

function UsersIndexPage() {
  return (
    <main className="mx-auto grid max-w-xl gap-6 p-6">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-primary">Users</h1>
        <Link
          className="rounded bg-primary px-4 py-2 font-medium text-white"
          to="/users/new"
        >
          Create user
        </Link>
      </header>
      <UserList
        renderUserLink={(user) => (
          <Link
            className="text-sm text-slate-700 underline"
            params={{ userId: user.id }}
            to="/users/$userId"
          >
            View details
          </Link>
        )}
      />
    </main>
  );
}

export const Route = createFileRoute("/users/")({
  component: UsersIndexPage,
});

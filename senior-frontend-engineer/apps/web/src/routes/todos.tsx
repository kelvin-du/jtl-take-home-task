import { Link, createFileRoute } from "@tanstack/react-router";
import { ToDoItems } from "@internal/todos";
import { useUserList } from "@internal/users";

function ToDosPage() {
  const usersQuery = useUserList();

  if (usersQuery.isPending) {
    return <p className="p-6" role="status">Loading users...</p>;
  }

  if (usersQuery.isError) {
    return (
      <main className="grid justify-items-start gap-2 p-6">
        <p role="alert">
          {usersQuery.error.message || "Could not load users."}
        </p>
        <button
          className="rounded border border-slate-300 px-3 py-1"
          onClick={() => void usersQuery.refetch()}
          type="button"
        >
          Retry
        </button>
      </main>
    );
  }

  if (usersQuery.data.length === 0) {
    return (
      <main className="grid justify-items-start gap-2 p-6">
        <p role="status">Create a user before adding todo items.</p>
        <Link className="underline" to="/users/new">
          Create user
        </Link>
      </main>
    );
  }

  return <ToDoItems users={usersQuery.data} />;
}

export const Route = createFileRoute("/todos")({
  component: ToDosPage,
});

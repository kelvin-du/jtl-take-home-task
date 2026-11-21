import { Link, createFileRoute } from "@tanstack/react-router";
import { useNotification } from "@internal/core/notifications";
import { ToDoItems } from "@internal/todos";
import { useUserList } from "@internal/users";

function ToDosPage() {
  const usersQuery = useUserList();
  const addNotification = useNotification();

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

  return (
    <ToDoItems
      onCreateError={(error) =>
        addNotification({
          type: "error",
          message: error.message || "Could not create the item.",
        })
      }
      onItemCreated={() =>
        addNotification({ type: "success", message: "Item added." })
      }
      users={usersQuery.data}
    />
  );
}

export const Route = createFileRoute("/todos")({
  component: ToDosPage,
});

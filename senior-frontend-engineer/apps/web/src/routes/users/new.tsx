import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useNotification } from "@internal/core/notifications";
import { CreateUserForm } from "@internal/users";
import type { User } from "@internal/users";

function CreateUserPage() {
  const navigate = useNavigate();
  const addNotification = useNotification();

  function handleUserCreated(user: User) {
    addNotification({
      type: "success",
      message: `User ${user.username} created.`,
    });
    void navigate({
      to: "/users/$userId",
      params: { userId: user.id },
    });
  }

  function handleCreateError(error: Error) {
    addNotification({
      type: "error",
      message: error.message || "Could not create the user.",
    });
  }

  return (
    <main className="mx-auto grid max-w-xl gap-6 p-6">
      <header className="grid gap-2">
        <Link className="w-fit text-sm text-slate-700 underline" to="/users">
          Back to users
        </Link>
        <h1 className="text-2xl font-semibold text-primary">Create user</h1>
      </header>
      <CreateUserForm
        onCreateError={handleCreateError}
        onUserCreated={handleUserCreated}
      />
    </main>
  );
}

export const Route = createFileRoute("/users/new")({
  component: CreateUserPage,
});

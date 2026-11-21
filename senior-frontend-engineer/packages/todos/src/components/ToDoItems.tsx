import { useState } from "react";
import type { SubmitEvent } from "react";
import { fakeBackend, type User } from "@internal/core";
import { useCreateToDoItem, useToDoItemsByUser } from "../hooks";
import { createToDoItemSchema } from "../validation";

interface ToDoItemsProps {
  users: User[];
  onItemCreated?: () => void;
  onCreateError?: (error: Error) => void;
}

export function ToDoItems({
  users,
  onItemCreated,
  onCreateError,
}: ToDoItemsProps) {
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [assigneeError, setAssigneeError] = useState<string | null>(null);
  const [simulateError, setSimulateError] = useState(false);
  const itemsQuery = useToDoItemsByUser(selectedUserId);
  const createMutation = useCreateToDoItem();
  const selectedUser = users.find((user) => user.id === selectedUserId);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = createToDoItemSchema.safeParse({
      title,
      assigneeId: selectedUserId,
    });
    if (!result.success) {
      setTitleError(
        result.error.issues.find((issue) => issue.path[0] === "title")
          ?.message ?? null,
      );
      setAssigneeError(
        result.error.issues.find((issue) => issue.path[0] === "assigneeId")
          ?.message ?? null,
      );
      return;
    }

    setTitleError(null);
    setAssigneeError(null);
    if (simulateError) {
      fakeBackend.failNext(
        "createToDoItem",
        new Error("Simulated add failure."),
      );
    }
    createMutation.mutate(result.data, {
      onSuccess: () => {
        setTitle("");
        onItemCreated?.();
      },
      onError: onCreateError,
    });
  };

  const handleAssigneeChange = (assigneeId: string) => {
    setSelectedUserId(assigneeId);
    setAssigneeError(null);
    createMutation.reset();
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setTitleError(null);
    createMutation.reset();
  };

  const titleDescribedBy =
    [
      titleError && "title-error",
      createMutation.isError && "create-todo-error",
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <main className="mx-auto grid max-w-xl gap-6 p-6">
      <h1 className="text-2xl font-semibold text-primary">Todo Items</h1>
      <form className="grid gap-3" noValidate onSubmit={handleSubmit}>
        <div className="grid gap-1">
          <label className="font-medium" htmlFor="assigneeId">
            Assignee
          </label>
          <select
            className="rounded border border-slate-300 px-3 py-2"
            disabled={createMutation.isPending || users.length === 0}
            id="assigneeId"
            name="assigneeId"
            onChange={(event) => handleAssigneeChange(event.target.value)}
            required
            value={selectedUserId}
            aria-describedby={assigneeError ? "assignee-error" : undefined}
            aria-invalid={assigneeError !== null}
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username} ({user.id})
              </option>
            ))}
          </select>
          {assigneeError && (
            <p
              className="text-sm text-red-700"
              id="assignee-error"
              role="alert"
            >
              {assigneeError}
            </p>
          )}
        </div>
        <div className="grid gap-1">
          <label className="font-medium" htmlFor="todo-title">
            Item title
          </label>
          <input
            className="rounded border border-slate-300 px-3 py-2"
            disabled={createMutation.isPending || !selectedUser}
            id="todo-title"
            name="title"
            onChange={(event) => handleTitleChange(event.target.value)}
            required
            type="text"
            value={title}
            aria-describedby={titleDescribedBy}
            aria-invalid={titleError !== null || createMutation.isError}
          />
          {titleError && (
            <p className="text-sm text-red-700" id="title-error" role="alert">
              {titleError}
            </p>
          )}
          {createMutation.isError && (
            <p
              className="text-sm text-red-700"
              id="create-todo-error"
              role="alert"
            >
              {createMutation.error.message || "Could not create the item."}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="w-fit rounded bg-primary px-4 py-2 font-medium text-white disabled:opacity-60"
            disabled={
              createMutation.isPending ||
              itemsQuery.isPending ||
              itemsQuery.isError ||
              !selectedUser
            }
            type="submit"
          >
            {createMutation.isPending ? "Adding..." : "Add item"}
          </button>
          <label className="flex items-center gap-2 text-sm">
            <input
              checked={simulateError}
              disabled={createMutation.isPending}
              onChange={(event) => setSimulateError(event.target.checked)}
              type="checkbox"
            />
            Simulate error
          </label>
        </div>
      </form>

      <section aria-labelledby="todo-list-heading" className="grid gap-3">
        <h2 className="text-xl font-semibold" id="todo-list-heading">
          Todo Items for {selectedUser?.username ?? "selected user"}
        </h2>
        {itemsQuery.isPending && <p role="status">Loading Todo Items...</p>}
        {itemsQuery.isError && (
          <div className="grid justify-items-start gap-2">
            <p role="alert">
              {itemsQuery.error.message || "Could not load Todo Items."}
            </p>
            <button
              className="rounded border border-slate-300 px-3 py-1"
              onClick={() => void itemsQuery.refetch()}
              type="button"
            >
              Retry
            </button>
          </div>
        )}
        {itemsQuery.isSuccess && itemsQuery.data.length === 0 && (
          <p role="status">
            No Todo Items assigned to {selectedUser?.username ?? "this user"}.
          </p>
        )}
        {itemsQuery.isSuccess && itemsQuery.data.length > 0 && (
          <ul aria-label="Todo Items" className="grid gap-2">
            {itemsQuery.data.map((item) => (
              <li
                className="rounded border border-slate-300 px-3 py-2"
                key={item.id}
              >
                {item.title}
                {item.id.startsWith("optimistic-") && (
                  <span className="ml-2 text-sm text-slate-600" role="status">
                    Saving...
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

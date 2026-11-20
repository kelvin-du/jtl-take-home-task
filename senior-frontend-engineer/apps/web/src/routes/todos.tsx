import { createFileRoute } from "@tanstack/react-router";

function ToDoItemsPage() {
  return null;
}

export const Route = createFileRoute("/todos")({
  component: ToDoItemsPage,
});

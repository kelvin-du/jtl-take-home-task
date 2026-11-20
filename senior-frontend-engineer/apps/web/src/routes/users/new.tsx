import { createFileRoute } from "@tanstack/react-router";

function CreateUserPage() {
  return null;
}

export const Route = createFileRoute("/users/new")({
  component: CreateUserPage,
});

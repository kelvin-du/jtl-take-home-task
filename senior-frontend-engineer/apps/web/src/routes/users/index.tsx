import { createFileRoute } from "@tanstack/react-router";

function UsersIndexPage() {
  return null;
}

export const Route = createFileRoute("/users/")({
  component: UsersIndexPage,
});

import { createFileRoute } from "@tanstack/react-router";

function UserDetailRouteView() {
  return null;
}

export const Route = createFileRoute("/users/$userId")({
  component: UserDetailRouteView,
});

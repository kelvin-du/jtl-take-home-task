import { createFileRoute, Outlet } from "@tanstack/react-router";

function UsersLayout() {
  return <Outlet />;
}

export const Route = createFileRoute("/users")({
  component: UsersLayout,
});

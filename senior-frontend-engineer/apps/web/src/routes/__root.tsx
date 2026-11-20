import { createRootRoute, Outlet } from "@tanstack/react-router";

function RootRouteView() {
  return <Outlet />;
}

export const Route = createRootRoute({
  component: RootRouteView,
});

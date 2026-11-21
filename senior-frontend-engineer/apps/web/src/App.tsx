import { RouterProvider } from "@tanstack/react-router";
import { NotificationsProvider } from "@internal/core/notifications";
import { router } from "./router";

export default function App() {
  return (
    <NotificationsProvider>
      <RouterProvider router={router} />
    </NotificationsProvider>
  );
}

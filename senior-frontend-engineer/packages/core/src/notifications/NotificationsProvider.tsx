import type { PropsWithChildren } from "react";
import { Provider } from "jotai";
import { NotificationViewport } from "./NotificationViewport";

export function NotificationsProvider({ children }: PropsWithChildren) {
  return (
    <Provider>
      {children}
      <NotificationViewport />
    </Provider>
  );
}

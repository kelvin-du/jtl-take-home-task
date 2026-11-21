import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  dismissNotificationAtom,
  notificationsAtom,
  type Notification,
} from "./notification-state";

interface NotificationCardProps {
  notification: Notification;
  onDismiss: (id: number) => void;
}

function NotificationCard({ notification, onDismiss }: NotificationCardProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => onDismiss(notification.id),
      3000,
    );
    return () => window.clearTimeout(timeoutId);
  }, [onDismiss, notification.id]);

  const appearance =
    notification.type === "error"
      ? "border-red-300 bg-red-50 text-red-900"
      : "border-green-300 bg-green-50 text-green-900";

  return (
    <div
      aria-atomic="true"
      aria-live={notification.type === "error" ? "assertive" : "polite"}
      className={`flex items-start justify-between gap-4 rounded border px-4 py-3 shadow-lg ${appearance}`}
      role={notification.type === "error" ? "alert" : "status"}
    >
      <p>{notification.message}</p>
      <button
        aria-label={`Dismiss notification: ${notification.message}`}
        className="shrink-0 rounded border border-current px-2 py-1 text-sm focus-visible:outline-2"
        onClick={() => onDismiss(notification.id)}
        type="button"
      >
        ✕
      </button>
    </div>
  );
}

export function NotificationViewport() {
  const notifications = useAtomValue(notificationsAtom);
  const dismissNotification = useSetAtom(dismissNotificationAtom);

  return (
    <section
      aria-label="Notifications"
      className="fixed right-4 top-4 z-50 grid w-80 max-w-[calc(100vw-2rem)] gap-3"
    >
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onDismiss={dismissNotification}
        />
      ))}
    </section>
  );
}

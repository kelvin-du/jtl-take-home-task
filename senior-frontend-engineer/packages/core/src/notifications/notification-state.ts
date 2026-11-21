import { atom } from "jotai";

export type NotificationType = "success" | "error";

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
}

export const notificationsAtom = atom<Notification[]>([]);

let nextNotificationId = 0;

export const addNotificationAtom = atom(
  null,
  (get, set, notification: Omit<Notification, "id">) => {
    set(notificationsAtom, [
      ...get(notificationsAtom),
      { ...notification, id: nextNotificationId++ },
    ]);
  },
);

export const dismissNotificationAtom = atom(null, (get, set, id: number) => {
  set(
    notificationsAtom,
    get(notificationsAtom).filter((notification) => notification.id !== id),
  );
});

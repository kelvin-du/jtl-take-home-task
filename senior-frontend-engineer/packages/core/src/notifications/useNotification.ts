import { useSetAtom } from "jotai";
import { addNotificationAtom } from "./notification-state";

export function useNotification() {
  return useSetAtom(addNotificationAtom);
}

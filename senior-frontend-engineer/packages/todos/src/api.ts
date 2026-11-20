import {
  fakeBackend,
  type CreateToDoItemInput,
  type ToDoItem,
} from "@internal/core";

export function createToDoItem(
  input: CreateToDoItemInput,
): Promise<ToDoItem> {
  return fakeBackend.createToDoItem(input);
}

export function listToDoItemsByUser(userId: string): Promise<ToDoItem[]> {
  return fakeBackend.listToDoItemsByUser(userId);
}

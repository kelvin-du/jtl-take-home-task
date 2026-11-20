import { fakeBackend, type User } from "@internal/core";

export function createUser(username: string): Promise<User> {
  return fakeBackend.createUser(username);
}

export function getUser(id: string): Promise<User | null> {
  return fakeBackend.getUser(id);
}

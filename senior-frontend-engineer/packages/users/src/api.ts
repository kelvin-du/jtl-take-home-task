import { fakeBackend } from "@internal/core";
import type { CreateUserInput, User } from "./types";

export function createUser(input: CreateUserInput): Promise<User> {
  return fakeBackend.createUser(input);
}

export function getUser(id: string): Promise<User | null> {
  return fakeBackend.getUser(id);
}

export function listUsers(): Promise<User[]> {
  return fakeBackend.listUsers();
}

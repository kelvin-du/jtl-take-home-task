export interface User {
  id: string;
  username: string;
  email: string;
}

export interface ToDoItem {
  id: string;
  title: string;
  assigneeId: string;
}

interface FakeDb {
  users: User[];
  toDoItems: ToDoItem[];
}

export type CreateToDoItemInput = Pick<ToDoItem, "title" | "assigneeId">;
export type CreateUserInput = Pick<User, "username" | "email">;

export type FakeBackendOperation =
  | "createUser"
  | "getUser"
  | "listUsers"
  | "createToDoItem"
  | "listToDoItemsByUser";

export interface FakeBackendOptions {
  latencyMs?: number;
}

export interface FakeBackend {
  createUser(input: CreateUserInput): Promise<User>;
  getUser(id: string): Promise<User | null>;
  listUsers(): Promise<User[]>;
  createToDoItem(input: CreateToDoItemInput): Promise<ToDoItem>;
  listToDoItemsByUser(userId: string): Promise<ToDoItem[]>;
  failNext(operation: FakeBackendOperation, error?: Error): void;
}

export function createFakeBackend({
  latencyMs = 300,
}: FakeBackendOptions = {}): FakeBackend {
  if (!Number.isFinite(latencyMs) || latencyMs < 0) {
    throw new RangeError("Fake API latency must be a non-negative number.");
  }

  const fakeDb: FakeDb = {
    users: [
      { id: "user-1", username: "Alice", email: "alice@example.com" },
      { id: "user-2", username: "Bob", email: "bob@example.com" },
      { id: "user-3", username: "Charlie", email: "charlie@example.com" },
    ],
    toDoItems: [],
  };

  let nextUserId = 4;
  let nextToDoItemId = 1;

  let pendingFailure:
    | { operation: FakeBackendOperation; error: Error }
    | undefined;

  async function execute<T>(
    operation: FakeBackendOperation,
    action: () => T,
  ): Promise<T> {
    await new Promise<void>((resolve) => setTimeout(resolve, latencyMs));

    if (pendingFailure?.operation === operation) {
      const { error } = pendingFailure;
      pendingFailure = undefined;
      throw error;
    }

    return action();
  }

  return {
    createUser(input) {
      return execute("createUser", () => {
        const username = input.username.trim();
        const email = input.email.trim();
        if (!email) {
          throw new Error("Email is required.");
        }

        const normalizedEmail = email.toLowerCase();
        const emailExists = fakeDb.users.some(
          (user) => user.email.trim().toLowerCase() === normalizedEmail,
        );
        if (emailExists) {
          throw new Error("Email is already in use.");
        }

        const user = { id: `user-${nextUserId++}`, username, email };
        fakeDb.users.push(user);
        return { ...user };
      });
    },
    getUser(id) {
      return execute("getUser", () => {
        const user = fakeDb.users.find((candidate) => candidate.id === id);
        return user ? { ...user } : null;
      });
    },
    listUsers() {
      return execute("listUsers", () =>
        fakeDb.users.map((user) => ({ ...user })),
      );
    },
    createToDoItem(input) {
      return execute("createToDoItem", () => {
        const assigneeExists = fakeDb.users.some(
          (user) => user.id === input.assigneeId,
        );
        if (!assigneeExists) {
          throw new Error(`User "${input.assigneeId}" does not exist.`);
        }

        const toDoItem = {
          id: `todo-${nextToDoItemId++}`,
          title: input.title,
          assigneeId: input.assigneeId,
        };
        fakeDb.toDoItems.push(toDoItem);
        return { ...toDoItem };
      });
    },
    listToDoItemsByUser(userId) {
      return execute("listToDoItemsByUser", () =>
        fakeDb.toDoItems
          .filter((toDoItem) => toDoItem.assigneeId === userId)
          .map((toDoItem) => ({ ...toDoItem })),
      );
    },
    failNext(operation, error = new Error(`Injected failure: ${operation}`)) {
      pendingFailure = { operation, error };
    },
  };
}

export const fakeBackend = createFakeBackend();

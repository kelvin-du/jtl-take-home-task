import { QueryClient } from "@tanstack/react-query";

export {
  createFakeBackend,
  fakeBackend,
  type CreateToDoItemInput,
  type FakeBackend,
  type FakeBackendOperation,
  type FakeBackendOptions,
  type ToDoItem,
  type User,
} from "./fake-backend";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

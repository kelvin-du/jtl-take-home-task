import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ToDoItem } from "@internal/core";
import { createToDoItem, listToDoItemsByUser } from "./api";

export const todoQueryKeys = {
  all: ["todos"] as const,
  byUser: (userId: string) => ["todos", "by-user", userId] as const,
};

export function useToDoItemsByUser(userId: string) {
  return useQuery({
    queryKey: todoQueryKeys.byUser(userId),
    queryFn: () => listToDoItemsByUser(userId),
    enabled: userId.trim().length > 0,
  });
}

let nextOptimisticId = 0;

export function useCreateToDoItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createToDoItem,
    onMutate: async (input) => {
      const queryKey = todoQueryKeys.byUser(input.assigneeId);
      await queryClient.cancelQueries({ queryKey, exact: true });

      const previousItems =
        queryClient.getQueryData<ToDoItem[]>(queryKey) ?? [];
      const optimisticId = `optimistic-${nextOptimisticId++}`;
      const optimisticItem: ToDoItem = {
        id: optimisticId,
        title: input.title,
        assigneeId: input.assigneeId,
      };

      queryClient.setQueryData(queryKey, [...previousItems, optimisticItem]);

      return { optimisticId, previousItems, queryKey };
    },
    onError: (_error, _input, context) => {
      if (context) {
        queryClient.setQueryData(context.queryKey, context.previousItems);
      }
    },
    onSuccess: (createdItem, _input, context) => {
      if (!context) {
        return;
      }

      queryClient.setQueryData<ToDoItem[]>(context.queryKey, (items) => {
        if (!items) {
          return [createdItem];
        }

        const optimisticIndex = items.findIndex(
          (item) => item.id === context.optimisticId,
        );
        if (optimisticIndex === -1) {
          return [...items, createdItem];
        }

        return items.map((item) =>
          item.id === context.optimisticId ? createdItem : item,
        );
      });
    },
    onSettled: async (_createdItem, _error, input) => {
      await queryClient.invalidateQueries({
        queryKey: todoQueryKeys.byUser(input.assigneeId),
        exact: true,
      });
    },
  });
}

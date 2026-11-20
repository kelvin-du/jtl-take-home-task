import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, getUser, listUsers } from "./api";

export const userQueryKeys = {
  all: ["users"] as const,
  list: ["users", "list"] as const,
  detail: (id: string) => ["users", "detail", id] as const,
};

export function useUserList() {
  return useQuery({
    queryKey: userQueryKeys.list,
    queryFn: listUsers,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userQueryKeys.detail(id),
    queryFn: () => getUser(id),
    enabled: id.trim().length > 0,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: async (user) => {
      queryClient.setQueryData(userQueryKeys.detail(user.id), user);
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.list });
    },
  });
}

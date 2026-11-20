import type { ReactNode } from "react";
import { useUserList } from "../hooks";
import type { User } from "../types";

interface UserListProps {
  renderUserLink: (user: User) => ReactNode;
}

export function UserList({ renderUserLink }: UserListProps) {
  const usersQuery = useUserList();

  if (usersQuery.isPending) {
    return <p role="status">Loading users...</p>;
  }

  if (usersQuery.isError) {
    return (
      <p role="alert">
        {usersQuery.error.message || "Could not load users."}
      </p>
    );
  }

  if (usersQuery.data.length === 0) {
    return <p role="status">No users found.</p>;
  }

  return (
    <ul className="grid gap-2" aria-label="Users">
      {usersQuery.data.map((user) => (
        <li
          className="flex items-center justify-between gap-4 rounded border border-slate-300 px-3 py-2"
          key={user.id}
        >
          <div className="grid gap-1">
            <span className="font-medium">{user.username}</span>
            <span className="text-sm text-slate-600">{user.email}</span>
          </div>
          {renderUserLink(user)}
        </li>
      ))}
    </ul>
  );
}

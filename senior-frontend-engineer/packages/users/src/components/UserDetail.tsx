import { useUser } from "../hooks";

interface UserDetailProps {
  userId: string;
}

export function UserDetail({ userId }: UserDetailProps) {
  const userQuery = useUser(userId);

  if (!userId.trim()) {
    return <p role="status">A user ID is required.</p>;
  }

  if (userQuery.isPending) {
    return <p role="status">Loading user...</p>;
  }

  if (userQuery.isError) {
    return (
      <p role="alert">
        {userQuery.error.message || "Could not load the user."}
      </p>
    );
  }

  if (!userQuery.data) {
    return <p role="status">User not found.</p>;
  }

  return (
    <section aria-labelledby="user-detail-heading" className="grid gap-3">
      <h1 className="text-2xl font-semibold text-primary" id="user-detail-heading">
        User details
      </h1>
      <dl className="grid gap-2">
        <div>
          <dt className="font-medium">Username</dt>
          <dd>{userQuery.data.username}</dd>
        </div>
        <div>
          <dt className="font-medium">Email</dt>
          <dd>{userQuery.data.email}</dd>
        </div>
        <div>
          <dt className="font-medium">User ID</dt>
          <dd>{userQuery.data.id}</dd>
        </div>
      </dl>
    </section>
  );
}

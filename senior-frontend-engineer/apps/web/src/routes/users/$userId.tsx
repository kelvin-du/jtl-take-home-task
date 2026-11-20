import { Link, createFileRoute } from "@tanstack/react-router";
import { UserDetail } from "@internal/users";

function UserDetailRouteView() {
  const { userId } = Route.useParams();

  return (
    <main className="mx-auto grid max-w-xl gap-6 p-6">
      <Link className="w-fit text-sm text-slate-700 underline" to="/users">
        Back to users
      </Link>
      <UserDetail userId={userId} />
    </main>
  );
}

export const Route = createFileRoute("/users/$userId")({
  component: UserDetailRouteView,
});

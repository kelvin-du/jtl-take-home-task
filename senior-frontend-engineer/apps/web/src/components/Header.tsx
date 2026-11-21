import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-3"
      >
        <Link
          className="rounded font-medium text-slate-700 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2"
          to="/users"
        >
          Users
        </Link>
        <Link
          className="rounded font-medium text-slate-700 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2"
          to="/todos"
        >
          Todo Items
        </Link>
      </nav>
    </header>
  );
}

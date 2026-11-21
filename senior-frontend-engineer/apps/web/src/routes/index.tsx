import { createFileRoute } from "@tanstack/react-router";

function HomePage() {
  return (
    <main className="mx-auto grid max-w-xl gap-6 p-6">
      <h1 className="text-2xl font-semibold text-primary">Hello, this is Task Board homepage</h1>
    </main>
  );
}

export const Route = createFileRoute("/")({
  component: HomePage,
});

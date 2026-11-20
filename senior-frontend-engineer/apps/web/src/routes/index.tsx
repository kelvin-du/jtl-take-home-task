import { createFileRoute } from "@tanstack/react-router";

function HomePage() {
  return null;
}

export const Route = createFileRoute("/")({
  component: HomePage,
});

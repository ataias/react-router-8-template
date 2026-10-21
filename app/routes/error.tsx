import type { Route } from "./+types/error";

export function clientLoader(_prop: Route.ClientLoaderArgs) {
  throw new Error("An error occurred");
}

export default function ErrorPage() {
  return <p>This route will end up erroing.</p>;
}

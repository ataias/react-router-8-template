export function clientLoader() {
  throw new Error("An error occurred");
}

export default function ErrorPage() {
  return <p>This route will end up erroing.</p>;
}

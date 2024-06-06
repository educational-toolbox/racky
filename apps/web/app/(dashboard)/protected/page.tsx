import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function ProtectedExamplesPage() {
  return (
    <div>
      <h1>Protected Examples</h1>
      <ul>
        <li>
          <Button asChild variant="link">
            <Link href="/protected/client-example">Client Example</Link>
          </Button>
        </li>
        <li>
          <Button asChild variant="link">
            <Link href="/protected/server-example">Server Example</Link>
          </Button>
        </li>
      </ul>
    </div>
  );
}

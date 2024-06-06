import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function PublicExamplesPage() {
  return (
    <div>
      <h1>Public Examples</h1>
      <ul>
        <li>
          <Button asChild variant="link">
            <Link href="/public/client-example">Client Example</Link>
          </Button>
        </li>
        <li>
          <Button asChild variant="link">
            <Link href="/public/server-example">Server Example</Link>
          </Button>
        </li>
      </ul>
    </div>
  );
}

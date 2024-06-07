import { AppLink } from "~/app-link";
import { Button } from "~/components/ui/button";

export default function ProtectedExamplesPage() {
  return (
    <div>
      <h1>Protected Examples</h1>
      <ul>
        <li>
          <Button asChild variant="link">
            <AppLink href="/protected/client-example">Client Example</AppLink>
          </Button>
        </li>
        <li>
          <Button asChild variant="link">
            <AppLink href="/protected/server-example">Server Example</AppLink>
          </Button>
        </li>
      </ul>
    </div>
  );
}

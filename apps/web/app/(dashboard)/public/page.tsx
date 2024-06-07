import { AppLink } from "~/app-link";
import { Button } from "~/components/ui/button";

export default function PublicExamplesPage() {
  return (
    <div>
      <h1>Public Examples</h1>
      <ul>
        <li>
          <Button asChild variant="link">
            <AppLink href="/public/client-example">Client Example</AppLink>
          </Button>
        </li>
        <li>
          <Button asChild variant="link">
            <AppLink href="/public/server-example">Server Example</AppLink>
          </Button>
        </li>
      </ul>
    </div>
  );
}

import { ClientDataExample } from "./example/client";
import { ServerDataExample } from "./example/server";

export default function Home() {
  return (
    <div>
      <ServerDataExample />
      <ClientDataExample />
    </div>
  );
}

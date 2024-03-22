import { ClientDataExample } from "./example/client";
import { MutationExample } from "./example/mutation";
import { ServerDataExample } from "./example/server";

export default function Home() {
  return (
    <div>
      <ServerDataExample />
      <ClientDataExample />
      <MutationExample />
    </div>
  );
}

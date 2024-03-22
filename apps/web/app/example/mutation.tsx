"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api/client";

export const MutationExample = () => {
  const [input, setInput] = useState("");
  const logs = api.getLogs.useQuery();
  const sayHiMutation = api.setHello.useMutation({
    async onSuccess() {
      await logs.refetch();
    },
  });
  const logData = logs.data ?? [];
  return (
    <form
      className="flex flex-col gap-2 max-w-64"
      onSubmit={(e) => {
        e.preventDefault();
        sayHiMutation
          .mutateAsync({
            name: input,
          })
          .then((entry) => {
            toast.success(`Successfully created new log entry ${entry}`);
            setInput("");
          })
          .catch(() => {
            toast.error("An error ocurred");
          });
      }}
    >
      <Input value={input} onChange={(e) => setInput(e.target.value)} />
      <Button type="submit">Submit</Button>
      <pre>{JSON.stringify(logData, null, 2)}</pre>
    </form>
  );
};

"use client";

import { Button } from "~/components/ui/button";

export const AcceptInvite = () => {
  return <Button className="w-full">Accept</Button>;
};

export const DeclineInvite = () => {
  return (
    <Button className="w-full" variant="secondary" disabled>
      Decline
    </Button>
  );
};

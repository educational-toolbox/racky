import { SignIn } from "@clerk/clerk-react";
import type { PropsWithChildren } from "react";
import { Card, CardHeader } from "~/components/ui/card";
import { useSession } from "~/lib/auth";

export const AcceptInviteLayout = function ({ children }: PropsWithChildren) {
  const session = useSession();

  const url = window.location.toString();

  if (session.state === "loading") {
    return null;
  }

  if (session.state !== "authenticated") {
    return (
      <div className="flex flex-col w-full min-h-svh items-center pt-4 sm:pt-8 md:pt-24">
        <SignIn fallbackRedirectUrl={url} forceRedirectUrl={url} />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-svh items-center pt-4 sm:pt-8 md:pt-24">
      <Card className="max-w-xs">
        <CardHeader>{children}</CardHeader>
      </Card>
    </div>
  );
};

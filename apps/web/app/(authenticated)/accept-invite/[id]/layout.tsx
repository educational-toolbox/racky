import type { PropsWithChildren } from "react";
import { Card, CardHeader } from "~/components/ui/card";

const AcceptInviteLayout = function ({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col w-full min-h-svh items-center pt-4 sm:pt-8 md:pt-24">
      <Card className="max-w-xs">
        <CardHeader>{children}</CardHeader>
      </Card>
    </div>
  );
};

export default AcceptInviteLayout;

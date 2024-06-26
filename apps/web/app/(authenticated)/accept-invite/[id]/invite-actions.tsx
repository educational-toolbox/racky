"use client";

import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useSession } from "~/lib/auth";
import { api } from "~/utils/api/client";

export const AcceptInvite = ({ id }: { id: string }) => {
  const session = useSession({ enforce: true });
  const acceptInviteMutation = api.org.acceptInvite.useMutation();
  const router = useRouter();
  if (session.state === "loading") {
    return "Loading...";
  }
  if (session.user.orgId != null) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={buttonVariants({
              className: "opacity-50 w-full cursor-not-allowed",
            })}
          >
            Accept
          </div>
        </TooltipTrigger>
        <TooltipContent>
          You are already a member of an organization. Please ask the
          organization owner to remove you from the organization or create a new
          account.
        </TooltipContent>
      </Tooltip>
    );
  }
  return (
    <Button
      className="w-full"
      disabled={acceptInviteMutation.isPending}
      onClick={async () => {
        await acceptInviteMutation.mutateAsync({ id });
        await session.invalidate();
        router.replace("/");
      }}
    >
      Accept
    </Button>
  );
};

export const DeclineInvite = ({ id }: { id: string }) => {
  console.log(id);
  return (
    <Button className="w-full" variant="secondary" disabled>
      Decline
    </Button>
  );
};

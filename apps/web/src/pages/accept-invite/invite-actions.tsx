import { Redirect } from "wouter";
import { Loader } from "~/components/shared/loader";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { api } from "~/lib/api/client";
import { useSession } from "~/lib/auth";

export const AcceptInvite = ({ id }: { id: string }) => {
  const session = useSession({ enforce: true });
  const acceptInviteMutation = api.org.acceptInvite.useMutation();
  if (session.state === "loading") {
    return <Loader centered />;
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
  if (acceptInviteMutation.isSuccess) {
    return <Redirect to="/" />;
  }
  return (
    <Button
      className="w-full"
      disabled={acceptInviteMutation.isPending}
      onClick={async () => {
        await acceptInviteMutation.mutateAsync({ id });
        await session.invalidate();
      }}
    >
      Accept
    </Button>
  );
};

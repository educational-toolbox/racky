import { api } from "~/lib/api/client";
import { AcceptInvite, DeclineInvite } from "./invite-actions";

const AcceptInvitePage = ({ id }: { id: string | undefined }) => {
  if (!id) {
    return <h1>Invite id not valid</h1>;
  }
  try {
    const { data: invite, isLoading } = api.org.getInvite.useQuery({
      id,
    });
    if (isLoading) {
      return <h1>Loading...</h1>;
    }
    if (!invite) {
      return <h1>Invite not found</h1>;
    }
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-center">
          You have been invited to join {invite.organizationName}
        </h1>
        <div className="flex gap-2">
          <DeclineInvite id={id} />
          <AcceptInvite id={id} />
        </div>
      </div>
    );
  } catch (error) {
    return (
      <>
        <span className="text-center text-balance font-bold">
          Invite expired.
        </span>
        <span className="text-center text-balance">
          Ask your administrator to send a new one.
        </span>
      </>
    );
  }
};

export default AcceptInvitePage;

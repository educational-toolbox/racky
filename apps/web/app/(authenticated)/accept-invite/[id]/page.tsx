import { api } from "~/utils/api/server";
import { AcceptInvite, DeclineInvite } from "./invite-actions";

const AcceptInvitePage = async ({
  params: { id },
}: {
  params: { id: string | undefined };
}) => {
  if (!id) {
    return <h1>Invite id not valid</h1>;
  }
  try {
    const invite = await api.org.getInvite.query({ id });
    // DISCUSS: Should we check for logged in user email, or invite id is enough?
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

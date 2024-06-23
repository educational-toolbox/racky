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
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-center">
          You have been invited to join {invite.organizationName}
        </h1>
        <div className="flex gap-2">
          <DeclineInvite />
          <AcceptInvite />
        </div>
      </div>
    );
  } catch (error) {
    return <h1>Invite not found</h1>;
  }
};

export default AcceptInvitePage;

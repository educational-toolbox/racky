import { Loader } from "~/components/shared/loader";
import { api } from "~/lib/api/client";
import { AcceptInvite } from "./invite-actions";

const AcceptInvitePage = ({ id }: { id: string | undefined }) => {
  const {
    data: invite,
    isLoading,
    isError,
  } = api.org.getInvite.useQuery({ id: id! }, { enabled: !!id });

  if (!id) {
    return <h1>Invite id not valid</h1>;
  }

  if (isLoading) {
    return <Loader centered />;
  }

  if (!invite) {
    return <h1>Invite not found</h1>;
  }

  if (isError) {
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

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-center">
        You have been invited to join {invite.organizationName}
      </h1>
      <div className="flex gap-2">
        <AcceptInvite id={id} />
      </div>
    </div>
  );
};

export default AcceptInvitePage;

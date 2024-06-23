import { Button, Html, Text } from "@react-email/components";
import { render as renderEmail } from "@react-email/components";

type InviteEmailData = {
  inviteUrl: string;
  orgName: string;
};

export const InviteEmail = ({ inviteUrl, orgName }: InviteEmailData) => {
  return (
    <Html>
      <Text>You've been invited to join {orgName}</Text>
      <Button
        href={inviteUrl}
        style={{ background: "#000", color: "#fff", padding: "12px 20px" }}
      >
        Join
      </Button>
    </Html>
  );
};

export default InviteEmail;
export const render = (data: InviteEmailData) =>
  renderEmail(<InviteEmail {...data} />);

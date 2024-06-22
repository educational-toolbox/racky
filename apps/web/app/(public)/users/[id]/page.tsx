import { UserCard } from "~/components/shared/user/user-card";
import { api } from "~/utils/api/server";

const UserPage = async ({
  params: { id: userId },
}: {
  params: { id: string };
}) => {
  const user = await api.user.getUser.query({ id: userId });
  if (!user) {
    return <h1>User not found</h1>;
  }
  return (
    <div className="w-full min-h-svh flex items-center justify-center">
      <UserCard user={user} />
    </div>
  );
};

export default UserPage;

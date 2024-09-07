import { UserCard } from "~/components/shared/user/user-card";
import { api } from "~/lib/api/client";

export const UserPage = ({ id }: { id: string }) => {
  const { isLoading, data } = api.user.getUser.useQuery({ id });
  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (!data) {
    return <h1>User not found</h1>;
  }
  return (
    <div className="w-full min-h-svh flex items-center justify-center">
      <UserCard user={data} />
    </div>
  );
};

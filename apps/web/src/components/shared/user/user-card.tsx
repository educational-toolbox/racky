import { AppLink } from "~/components/app-link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { CardClasses, CardDescription, CardTitle } from "~/components/ui/card";
import { api } from "~/lib/api/client";
import { cn } from "~/lib/utils";
import { Loader } from "../loader";

type User = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  avatarUrl?: string;
};

export type UserCardProps = ({ user: User } | { userId: string }) & {
  link?: boolean;
  className?: string;
};
export const UserCard = ({
  link = false,
  className = "",
  ...props
}: UserCardProps) => {
  const userId = "userId" in props ? props.userId : props.user.id;
  const requiresLoading = "userId" in props;

  const { data, isLoading } = api.user.getUser.useQuery(
    { id: userId },
    {
      enabled: requiresLoading,
    },
  );

  if (isLoading || (!data && requiresLoading)) {
    return <Loader centered />;
  }

  const user = "user" in props ? props.user : data!;
  return <UserCardInner user={user} link={link} className={className} />;
};

const UserCardInner = ({
  user,
  className,
  link,
}: {
  user: User;
  link?: boolean;
  className?: string;
}) => {
  const Wrapper = link ? AppLink : "div";
  const wrapperProps = link ? { absolute: true } : {};

  let fallback = "AN";
  if (user.firstName) {
    fallback = user.firstName.slice(0, 2);
  }
  if (user.lastName) {
    fallback = user.lastName.slice(0, 2);
  }
  if (user.firstName && user.lastName) {
    fallback = user.firstName[0] + user.lastName[0];
  }
  return (
    <Wrapper
      href={`/social/user/${user.id}`}
      {...wrapperProps}
      className={cn(CardClasses.root, "p-2 flex gap-1 items-center", className)}
    >
      <Avatar>
        <AvatarImage src={user.avatarUrl} />
        <AvatarFallback>{fallback.toLocaleUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <CardTitle className="leading-none">
          {user.firstName} {user.lastName}
        </CardTitle>
        <CardDescription className="leading-none">{user.email}</CardDescription>
      </div>
    </Wrapper>
  );
};

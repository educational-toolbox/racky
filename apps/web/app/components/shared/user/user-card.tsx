import { AppLink } from "~/app-link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { CardClasses, CardDescription, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

export interface UserCardProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
  };
  link?: boolean;
  className?: string;
}

export const UserCard = ({
  user,
  link = false,
  className = "",
}: UserCardProps) => {
  const Wrapper = link ? AppLink : "div";
  return (
    <Wrapper
      href={`/users/${user.id}`}
      className={cn(CardClasses.root, "p-2 flex gap-1 items-center", className)}
    >
      <Avatar>
        <AvatarImage src={user.avatarUrl} />
        <AvatarFallback>
          {user.firstName[0].toLocaleUpperCase()}
          {user.lastName[0].toLocaleUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <CardTitle>
          {user.firstName} {user.lastName}
        </CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </div>
    </Wrapper>
  );
};

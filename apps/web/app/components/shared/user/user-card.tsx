import { AppLink } from "~/app-link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { CardClasses, CardDescription, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

export interface UserCardProps {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
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
      href={`/users/${user.id}`}
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

import { AppLink } from "~/components/app-link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Icon } from "~/components/shared/app-icon";
import type { IconName } from "~/components/shared/app-icon";

const DashboardLink = ({
  href,
  description,
  title,
  icon,
}: {
  href: `/${string}`;
  icon: IconName;
  title: string;
  description: string;
}) => (
  <AppLink href={href}>
    <Card className="transition-transform hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex gap-1 items-center">
          <Icon name={icon} size={20} />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  </AppLink>
);

export const DashboardRootPage = () => {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2">
      <DashboardLink
        title="Users"
        description="Organizations users"
        href="/users"
        icon="User"
      />
      <DashboardLink
        title="Inventory"
        description="Inventory overview"
        href="/inventory"
        icon="Package"
      />
      <DashboardLink
        title="Reservations"
        description="Reservations overview"
        href="/reservations"
        icon="Calendar"
      />
    </div>
  );
};

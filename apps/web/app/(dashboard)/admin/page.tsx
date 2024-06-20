import type { icons } from "lucide-react";
import { AppLink } from "~/app-link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Icon from "~/components/ui/icon";

export default function AdminDashboard() {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2">
      <AdminLink
        title="Organizations"
        description="Manage organizations"
        href="/admin/organizations"
        icon="Building"
      />
    </div>
  );
}

const AdminLink = ({
  href,
  description,
  title,
  icon,
}: {
  href: string;
  icon: keyof typeof icons;
  title: string;
  description: string;
}) => (
  <AppLink href={href}>
    <Card>
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

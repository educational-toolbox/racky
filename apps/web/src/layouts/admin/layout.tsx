import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { RequireAccessLevel } from "~/lib/auth";
import { useMenuItems } from "../dashboard/menu-items.store";

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <RequireAccessLevel level="ADMIN" allowOverride>
      <AdminInner>{children}</AdminInner>
    </RequireAccessLevel>
  );
}

const AdminInner = ({ children }: PropsWithChildren) => {
  const { add, remove } = useMenuItems();
  useEffect(() => {
    const ids = [
      add({
        type: "separator",
        id: "$separator-admin",
      }),
      add({
        type: "item",
        id: "$item-admin-organizations",
        href: "/admin/organizations",
        label: "Organizations",
        icon: "Building",
      }),
    ];
    return () => {
      ids.forEach(remove);
    };
  }, [add, remove]);

  return <>{children}</>;
};

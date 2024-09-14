import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { RequireAccessLevel } from "~/lib/auth";
import { useMenuItems } from "../dashboard/menu-items.store";

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <RequireAccessLevel level="ADMIN" exclusive>
      <AdminInner>{children}</AdminInner>
    </RequireAccessLevel>
  );
}

const AdminInner = ({ children }: PropsWithChildren) => {
  const { add, remove } = useMenuItems();
  useEffect(() => {
    const ids = [
      add({
        type: "item",
        starred: true,
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

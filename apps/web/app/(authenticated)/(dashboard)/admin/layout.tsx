"use client";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { RequireAccessLevel } from "~/lib/auth";
import { useMenuItems } from "../menu-items.store";

export default function AdminLayout({ children }: PropsWithChildren) {
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

  return (
    <RequireAccessLevel level="ADMIN" onFailRedirectTo="/">
      {children}
    </RequireAccessLevel>
  );
}

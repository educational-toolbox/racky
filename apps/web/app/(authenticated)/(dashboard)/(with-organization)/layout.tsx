"use client";

import { useEffect } from "react";
import type { PropsWithChildren } from "react";
import { useMenuItems } from "../menu-items.store";
import { useOrganizationId } from "../organization-context";

const LayoutNameLayout = function ({ children }: PropsWithChildren) {
  const { add, remove } = useMenuItems();
  const orgId = useOrganizationId();
  useEffect(() => {
    const ids = [
      add({
        href: "/users",
        icon: "UserSearch",
        id: "$item-users-management",
        label: "Manage users",
        type: "item",
      }),
    ];
    return () => {
      for (const id of ids) remove(id);
    };
  }, [add, remove]);
  if (!orgId)
    return (
      <div className="text-center">
        You aren&apos;t a member of any organization. Please ask your
        administrator to invite you.
      </div>
    );
  return children;
};

export default LayoutNameLayout;

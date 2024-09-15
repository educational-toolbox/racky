import { Route } from "wouter";
import OrganizationUsersPage from "./users/users.page";

import { useEffect } from "react";
import type { PropsWithChildren } from "react";
import { useMenuItems } from "~/layouts/dashboard/menu-items.store";
import { useOrganizationId } from "./organization-context";
import { InventoryPage } from "./inventory/inventory.page";
import { ReservationsPage } from "./reservations/reservations.page";
import { DashboardRootPage } from "./dashboard-root.page";

const AssingedToDashboard = function ({ children }: PropsWithChildren) {
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
      add({
        href: "/inventory",
        icon: "Package",
        id: "$item-inventory",
        label: "Inventory",
        type: "item",
      }),
      add({
        href: "/reservations",
        icon: "Calendar",
        id: "$item-reservations",
        label: "Reservations",
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

export const DashboardRouter = () => {
  return (
    <AssingedToDashboard>
      <Route path="/">
        <DashboardRootPage />
      </Route>
      <Route path="/users">
        <OrganizationUsersPage />
      </Route>
      <Route path="/inventory">
        <InventoryPage />
      </Route>
      <Route path="/reservations">
        <ReservationsPage />
      </Route>
    </AssingedToDashboard>
  );
};

import { Route } from "wouter";
import { AdminOrganizationsPage } from "./organizations/organization.page";
import { AdminDashboard } from "./admin-root.page";
import { RequireAccessLevel } from "~/lib/auth";

export const AdminRouter = () => {
  return (
    <Route path="/admin" nest>
      <RequireAccessLevel level="ADMIN" superadmin>
        <Route path="/organizations">
          <AdminOrganizationsPage />
        </Route>
        <Route path="/">
          <AdminDashboard />
        </Route>
      </RequireAccessLevel>
    </Route>
  );
};

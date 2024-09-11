import { Route } from "wouter";
import { AdminOrganizationsPage } from "./organizations/organization.page";
import { AdminDashboard } from "./admin-root.page";

export const AdminRouter = () => {
  return (
    <Route path="/admin" nest>
      <Route path="/organizations">
        <AdminOrganizationsPage />
      </Route>
      <Route path="/">
        <AdminDashboard />
      </Route>
    </Route>
  );
};

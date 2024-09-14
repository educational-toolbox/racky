import { SignIn } from "@clerk/clerk-react";
import { Redirect, Route, Switch } from "wouter";
import { AcceptInviteLayout } from "./layouts/accept-invite/accept-invite.layout";
import AdminLayout from "./layouts/admin/layout";
import DashboardLayout from "./layouts/dashboard/layout";
import { SignedIn, SignedInAsAnonymous, SignedOut } from "./lib/auth";
import AcceptInvitePage from "./pages/accept-invite/accept-invite.page";
import { AdminRouter } from "./pages/admin/router";
import { DashboardRouter } from "./pages/dashboard/dashboard.router";
import { UserPage } from "./pages/social/user.page";

export const AppRouter = () => {
  return (
    <Switch>
      <Route path="/app" nest>
        <SignedInAsAnonymous>
          <span className="text-center w-full block py-12">
            Acount is not verified. Please wait while we verify your account.
          </span>
        </SignedInAsAnonymous>
        <SignedIn>
          <DashboardLayout>
            <DashboardRouter />
            <AdminLayout>
              <AdminRouter />
            </AdminLayout>
          </DashboardLayout>
        </SignedIn>
      </Route>

      <Route path="/auth" nest>
        <SignIn />
      </Route>

      <Route path="/social" nest>
        <Route path="/user/:id">
          {(params) => <UserPage id={params.id} />}
        </Route>
      </Route>

      <Route path="/accept-invite/:id" nest>
        {(params) => (
          <AcceptInviteLayout>
            <AcceptInvitePage id={params.id} />
          </AcceptInviteLayout>
        )}
      </Route>

      <Route>
        <SignedIn>
          <Redirect to="/app" />
        </SignedIn>
        <SignedOut>
          <Redirect to="/auth" />
        </SignedOut>
      </Route>
    </Switch>
  );
};

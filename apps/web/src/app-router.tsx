import { SignIn } from "@clerk/clerk-react";
import { Redirect, Route, Switch } from "wouter";
import { AcceptInviteLayout } from "./layouts/accept-invite/accept-invite.layout";
import AdminLayout from "./layouts/admin/layout";
import DashboardLayout from "./layouts/dashboard/layout";
import {
  SignedIn,
  SignedInAsAnonymous,
  SignedOut,
  useSession,
} from "./lib/auth";
import { lazy, Suspense } from "react";
import { Loader } from "./components/shared/loader";
const UserPage = lazy(() =>
  import("./pages/social/user.page").then((module) => ({
    default: module.UserPage,
  })),
);
const AcceptInvitePage = lazy(
  () => import("./pages/accept-invite/accept-invite.page"),
);
const DashboardRouter = lazy(() =>
  import("./pages/dashboard/dashboard.router").then((module) => ({
    default: module.DashboardRouter,
  })),
);
const AdminRouter = lazy(() =>
  import("./pages/admin/router").then((module) => ({
    default: module.AdminRouter,
  })),
);

export const AppRouter = () => {
  return (
    <Switch>
      <Route path="/app" nest>
        <SignedInAsAnonymous>
          <AnonymousPage />
        </SignedInAsAnonymous>
        <SignedIn>
          <DashboardLayout>
            <Suspense fallback={<Loader centered />}>
              <DashboardRouter />
            </Suspense>
            <AdminLayout>
              <Suspense fallback={<Loader centered />}>
                <AdminRouter />
              </Suspense>
            </AdminLayout>
          </DashboardLayout>
        </SignedIn>
      </Route>

      <Route path="/auth" nest>
        <SignIn />
      </Route>

      <Route path="/social" nest>
        <Route path="/user/:id">
          {(params) => (
            <Suspense fallback={<Loader centered />}>
              <UserPage id={params.id} />
            </Suspense>
          )}
        </Route>
      </Route>

      <Route path="/accept-invite/:id" nest>
        {(params) => (
          <AcceptInviteLayout>
            <Suspense fallback={<Loader centered />}>
              <AcceptInvitePage id={params.id} />
            </Suspense>
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

const AnonymousPage = () => {
  const session = useSession();
  return (
    <div>
      <span className="text-center w-full block py-12">
        Acount is not verified. Please wait while we verify your account.
      </span>
      <div className="flex items-center justify-center w-full">
        <pre className="rounded-md p-2 border">
          {JSON.stringify(session.user, null, 2)}
        </pre>
      </div>
    </div>
  );
};

import { SignIn } from "@clerk/clerk-react";
import { Redirect, Route, Switch } from "wouter";
import { AcceptInviteLayout } from "./layouts/accept-invite/accept-invite.layout";
import AdminLayout from "./layouts/admin/layout";
import DashboardLayout from "./layouts/dashboard/layout";
import {
  SignedIn,
  SignedInAsAnonymous,
  SignedOut,
  SignOutButton,
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
        <SignedOut>
          <Redirect to="~/auth" />
        </SignedOut>
        <SignedInAsAnonymous>
          <Redirect to="~/" />
        </SignedInAsAnonymous>
      </Route>

      <Route path="/auth" nest>
        <AuthPage />
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
        <SignedInAsAnonymous>
          <AnonymousPage />
        </SignedInAsAnonymous>
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
    <div className="w-full grid place-items-center">
      <div className="max-w-[400px]">
        <div className="pt-12 mb-4">
          Acount is not verified. <br /> Please wait while we verify your
          account.
        </div>
        <pre className="rounded-md p-2 border">
          id : {session.user?.id}
          <br />
          org: {session.user?.orgId || "none"}
        </pre>
        <SignOutButton full className="w-full mt-2" />
      </div>
    </div>
  );
};

const AuthPage = () => {
  return (
    <div className="w-screen h-svh grid place-items-center">
      <SignIn />
    </div>
  );
};

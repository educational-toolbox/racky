import { RedirectToSignIn } from "@clerk/nextjs";
import type { PropsWithChildren } from "react";
import { SignedIn, SignedOut } from "~/lib/auth";
import { OrganizationIdProvider } from "./(dashboard)/organization-context";

const Inner = ({ children }: PropsWithChildren) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        {/* TODO: Replace Clerk's redirect to sign-in with in-house impl */}
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

const AuthenticatedLayout = ({ children }: PropsWithChildren) => {
  return (
    <OrganizationIdProvider>
      <Inner>{children}</Inner>
    </OrganizationIdProvider>
  );
};

export default AuthenticatedLayout;

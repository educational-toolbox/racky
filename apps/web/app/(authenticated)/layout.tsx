"use client";

import { RedirectToSignIn } from "@clerk/nextjs";
import { useEffect } from "react";
import type { PropsWithChildren } from "react";
import { useMenuItems } from "~/(authenticated)/(dashboard)/menu-items.store";
import { SignedIn, SignedOut } from "~/lib/auth";

const AuthenticatedLayout = ({ children }: PropsWithChildren) => {
  const { add, remove } = useMenuItems();

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

export default AuthenticatedLayout;

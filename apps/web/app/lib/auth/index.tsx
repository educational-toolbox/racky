"use client";

import { useAuth } from "@clerk/nextjs";
import { LogOutIcon, ShieldCheckIcon } from "lucide-react";
import type { PropsWithChildren } from "react";
import { createContext, useCallback, useContext, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api/client";
import type { Session } from "./session.type";
import { useMenuItems } from "~/(dashboard)/menu-items.store";
import { useRouter } from "next/navigation";

const sessionContext = createContext<Session>({
  state: "loading",
  user: undefined,
  invalidate() {
    throw new Error("Not implemented");
  },
});

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const { data: user, isLoading, refetch } = api.auth.session.useQuery();

  const invalidate = useCallback<Session["invalidate"]>(async () => {
    await refetch();
  }, [refetch]);

  let value: Session;
  if (isLoading) {
    value = {
      state: "loading",
      user: undefined,
      invalidate,
    };
  } else if (user != null) {
    value = {
      state: "authenticated",
      user,
      invalidate,
    };
  } else {
    value = {
      state: "unauthenticated",
      user: undefined,
      invalidate,
    };
  }

  // Can't think of a better solution for now...
  const { add, remove } = useMenuItems();
  useEffect(() => {
    if (value.state === "authenticated" && value.user.role === "ADMIN") {
      add({
        type: "separator",
        id: "$separator-admin",
      });
      add({
        type: "item",
        id: "$item-admin-ashboard",
        href: "/admin",
        label: "Admin Dashboard",
        icon: ShieldCheckIcon,
      });
    } else {
      remove("$separator-admin");
      remove("$item-admin-ashboard");
    }
  }, [add, remove, value]);

  return (
    <sessionContext.Provider value={value}>{children}</sessionContext.Provider>
  );
};

export const useSession = () => useContext(sessionContext);

export const SignedIn = ({ children }: PropsWithChildren) => {
  const session = useSession();
  if (session.state === "authenticated") {
    return <>{children}</>;
  }
  if (session.state === "loading") {
    return null;
  }
  return null;
};

export const SignedOut = ({ children }: PropsWithChildren) => {
  const session = useSession();
  if (session.state === "unauthenticated") {
    return <>{children}</>;
  }
  if (session.state === "loading") {
    return null;
  }
  return null;
};

export const SignOutButton = () => {
  const auth = useAuth();
  const session = useSession();
  return (
    <Button
      onClick={async () => {
        await auth.signOut();
        await session.invalidate();
      }}
      size="icon"
      variant="outline"
    >
      <LogOutIcon />
    </Button>
  );
};

export const RequireAccessLevel = ({
  level: role,
  children,
  onFailRedirectTo = "/",
}: PropsWithChildren<{
  level: NonNullable<Session["user"]>["role"];
  onFailRedirectTo?: string;
}>) => {
  const session = useSession();
  const router = useRouter();
  const allowed =
    session.state === "authenticated" && session.user.role === role;
  useEffect(() => {
    if (!allowed) router.replace(onFailRedirectTo);
  }, [allowed, onFailRedirectTo, router]);
  if (allowed) {
    return <>{children}</>;
  }
  return null;
};

"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";
import { createContext, useCallback, useContext, useEffect } from "react";
import { Icon } from "~/components/ui/app-icon";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api/client";
import type {
  AuthenticatedSession,
  LoadingSession,
  Session,
} from "./session.type";

const sessionContext = createContext<Session>({
  state: "loading",
  user: undefined,
});

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const { data: user, isLoading, refetch } = api.user.whoami.useQuery();

  const invalidate = useCallback<
    AuthenticatedSession["invalidate"]
  >(async () => {
    await refetch();
  }, [refetch]);

  let value: Session;
  if (isLoading) {
    value = {
      state: "loading",
      user: undefined,
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

  return (
    <sessionContext.Provider value={value}>{children}</sessionContext.Provider>
  );
};

export function useSession(params: {
  enforce: true;
}): LoadingSession | AuthenticatedSession;
export function useSession(params?: { enforce: boolean }): Session;
export function useSession({ enforce = false } = {}) {
  const session = useContext(sessionContext);
  if (enforce && session.state === "unauthenticated") {
    throw new Error("User is not authenticated");
  }
  if (enforce) {
    return session as LoadingSession | AuthenticatedSession;
  }
  return session;
}

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
        if (session.state !== "loading") {
          await session.invalidate();
        }
      }}
      size="icon"
      variant="outline"
    >
      <Icon name="LogOut" />
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
    if (!allowed && onFailRedirectTo !== undefined) {
      router.replace(onFailRedirectTo);
    }
  }, [allowed, onFailRedirectTo, router]);
  if (allowed) {
    return <>{children}</>;
  }
  return null;
};

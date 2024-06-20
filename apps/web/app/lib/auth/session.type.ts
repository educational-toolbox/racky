import type { AuthUser } from "../../../../server/src/auth/auth-user.type";

export interface LoadingSession {
  user: undefined;
  state: "loading";
}

export interface UnauthenticatedSession {
  user: undefined;
  state: "unauthenticated";
}

export interface AuthenticatedSession {
  user: AuthUser;
  state: "authenticated";
}

export type Session = (
  | LoadingSession
  | UnauthenticatedSession
  | AuthenticatedSession
) & { invalidate: () => Promise<void> };

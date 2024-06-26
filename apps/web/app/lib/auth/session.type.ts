import type { AuthUser } from "../../../../server/src/auth/auth-user.type";

export interface LoadingSession {
  user: undefined;
  state: "loading";
}

export interface UnauthenticatedSession {
  user: undefined;
  state: "unauthenticated";
  invalidate: () => Promise<void>;
}

export interface AuthenticatedSession {
  user: AuthUser;
  state: "authenticated";
  invalidate: () => Promise<void>;
}

export type Session =
  | LoadingSession
  | UnauthenticatedSession
  | AuthenticatedSession;

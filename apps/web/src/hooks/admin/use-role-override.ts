import { useSession } from "~/lib/auth";
import type { UserRole } from "~/lib/auth/session.type";
import { useExtractedSearchParams } from "../use-extracted-searchparams";
import { useLocalStorage } from "~/hooks/use-local-storage";
import { useIsFirstRender } from "~/hooks/use-is-first-render";
import { useCallback, useEffect } from "react";

type UseRoleOverrideReturn =
  | {
      allowed: false;
      originalRole?: UserRole;
    }
  | {
      allowed: true;
      enabled: boolean;
      viewAs: UserRole;
      originalRole: UserRole;
      setViewAs: (role: UserRole) => void;
    };

export const useRoleOverride = (): UseRoleOverrideReturn => {
  const session = useSession();
  const isFirstRender = useIsFirstRender();
  const [value, setLocalStorage] = useLocalStorage<UserRole | undefined>(
    "viewAs",
    "USER"
  );
  const [params, update] = useExtractedSearchParams<"viewAs", UserRole>();

  useEffect(() => {
    if (!isFirstRender) {
      return;
    }
    if (value) {
      update({ viewAs: value });
    }
  }, [value, isFirstRender]);

  useEffect(() => {
    setLocalStorage(params.viewAs);
  }, [params.viewAs, setLocalStorage]);

  const setViewAs = useCallback(
    (role: UserRole) => {
      update({ viewAs: role === "ADMIN" ? undefined : role });
    },
    [update]
  );

  if (!session) {
    return {
      allowed: false,
    };
  }
  if (session.user?.role !== "ADMIN") {
    return {
      allowed: false,
      originalRole: session.user?.role,
    };
  }
  return {
    allowed: true,
    enabled: params.viewAs === "USER",
    originalRole: session.user.role,
    viewAs: value || "ADMIN",
    setViewAs,
  };
};

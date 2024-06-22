import type { PropsWithChildren } from "react";
import { OrganizationIdProvider } from "../organization-context";

const WithOrganizationLayout = function ({ children }: PropsWithChildren) {
  return <OrganizationIdProvider strict>{children}</OrganizationIdProvider>;
};

export default WithOrganizationLayout;

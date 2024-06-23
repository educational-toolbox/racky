import { organizationPermissionsFor } from '~/business/organization/organization.permissions';
import type { AuthUser } from './auth-user.type';

export const getPermissions = (user: AuthUser) => {
  return {
    organization: organizationPermissionsFor(user),
  };
};

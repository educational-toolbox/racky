import { organizationPermissionsFor } from '../organization/organization.permissions';
import { AuthUser } from './auth-user.type';

export const getPermissions = (user: AuthUser) => {
  return {
    organization: organizationPermissionsFor(user),
  };
};

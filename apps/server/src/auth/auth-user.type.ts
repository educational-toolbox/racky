import type { User } from '@prisma/client';
import type { getPermissions } from './permissions';

export type AuthUser = {
  id: User['id'];
  orgId: User['organizationId'];
  role: User['role'];
};

export type AuthUserWithPermissions = AuthUser & {
  permissions: ReturnType<typeof getPermissions>;
};

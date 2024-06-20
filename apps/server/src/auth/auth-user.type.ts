import { User } from '@prisma/client';

export type AuthUser = {
  id: User['id'];
  orgId: User['organizationId'];
  role: User['role'];
};

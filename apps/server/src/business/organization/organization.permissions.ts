import { abilities } from '../../auth/ability-factory';
import type { AuthUser } from '../../auth/auth-user.type';

export const organizationPermissionsFor = (user: AuthUser) => {
  abilities.can('read', 'Organization', { users: { some: { id: user.id } } });
  abilities.can('read', 'Organization', { ownerId: user.id });
  abilities.can('update', 'Organization', { ownerId: user.id });
  if (user.orgId) {
    abilities.can('create', 'OrganizationInvite', {
      organizationId: user.orgId,
    });
  }
  if (user.role === 'ADMIN') {
    abilities.can('manage', 'Organization');
  }
  return abilities.build();
};

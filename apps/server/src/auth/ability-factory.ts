import type { PureAbility } from '@casl/ability';
import { AbilityBuilder } from '@casl/ability';
import type { PrismaQuery, Subjects } from '@casl/prisma';
import { createPrismaAbility } from '@casl/prisma';
import type {
  CatalogItem,
  Category,
  Item,
  Organization,
  OrganizationInvite,
  Reservation,
  ReservationItem,
  User,
} from '@prisma/client';

export type AbilityActions = 'manage' | 'create' | 'read' | 'update' | 'delete';

export type AppAbility = PureAbility<
  [
    AbilityActions,
    Subjects<{
      User: User;
      CatalogItem: CatalogItem;
      Category: Category;
      Item: Item;
      Organization: Organization;
      OrganizationInvite: OrganizationInvite;
      Reservation: Reservation;
      ReservationItem: ReservationItem;
    }>,
  ],
  PrismaQuery
>;

export const abilities = new AbilityBuilder<AppAbility>(createPrismaAbility);

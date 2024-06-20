import { AbilityBuilder, PureAbility } from '@casl/ability';
import { PrismaQuery, Subjects, createPrismaAbility } from '@casl/prisma';
import {
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

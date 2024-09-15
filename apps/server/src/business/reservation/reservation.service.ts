import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { ReservationRead, ReservationWrite } from './reservation.schema';

type ExtendedReservationRead = ReservationRead & {
  item: {
    id: string;
    name: string;
    picture: string | null;
    catalogueItem: {
      id: string;
      name: string;
      category: {
        id: string;
        name: string;
      };
    };
  };
};

@Injectable()
export class ReservationService {
  constructor(private readonly databaseService: DatabaseService) {}

  findAll() {
    return this.databaseService.reservation.findMany();
  }

  findOne(reservationId: string): Promise<ReservationRead | null> {
    return this.databaseService.reservation.findUnique({
      where: { id: reservationId },
    });
  }

  findByUserId(userId: string): Promise<ExtendedReservationRead[]> {
    return this.databaseService.reservation.findMany({
      where: { userId },
      include: {
        item: {
          select: {
            id: true,
            name: true,
            picture: true,
            catalogueItem: {
              select: {
                id: true,
                name: true,
                category: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    });
  }

  findActiveForItem(itemId: string, orgId: string): Promise<ReservationRead[]> {
    return this.databaseService.reservation.findMany({
      where: {
        status: { not: 'CANCELLED' },
        item: { id: itemId, catalogueItem: { organizationId: orgId } },
      },
    });
  }

  findByOrgId(orgId: string): Promise<ExtendedReservationRead[]> {
    return this.databaseService.reservation.findMany({
      where: {
        item: { catalogueItem: { organizationId: orgId } },
      },
      include: {
        item: {
          select: {
            id: true,
            name: true,
            picture: true,
            catalogueItem: {
              select: {
                id: true,
                name: true,
                category: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    });
  }

  create(
    reservation: ReservationWrite,
    userId: string,
    orgId: string,
  ): Promise<ReservationRead> {
    return this.databaseService.reservation.create({
      data: {
        endDate: reservation.endDate,
        startDate: reservation.startDate,
        status: 'PENDING',
        item: {
          connect: {
            id: reservation.itemId,
            catalogueItem: { organizationId: orgId },
          },
        },
        user: { connect: { id: userId } },
      },
    });
  }

  cancel(reservationId: string, userId: string): Promise<ReservationRead> {
    return this.databaseService.reservation.update({
      where: { id: reservationId, userId: userId },
      data: { status: 'CANCELLED' },
    });
  }

  update(
    reservation: Partial<ReservationRead> & { id: string },
  ): Promise<ReservationRead> {
    return this.databaseService.reservation.update({
      where: { id: reservation.id },
      data: reservation,
    });
  }

  delete(reservationId: string): Promise<ReservationRead> {
    return this.databaseService.reservation.delete({
      where: { id: reservationId },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { ReservationRead, ReservationWrite } from './reservation.schema';
import { NotificationService } from '../notification/notification.service';

type ExtendedReservationRead = ReservationRead & {
  user: {
    id: string;
  };
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
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly notificationService: NotificationService,
  ) {}

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
        user: {
          select: { id: true },
        },
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
        user: {
          select: { id: true },
        },
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

  async create(
    reservation: ReservationWrite,
    userId: string,
    orgId: string,
  ): Promise<ReservationRead> {
    const result = await this.databaseService.reservation.create({
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

    return result;
  }

  cancel(reservationId: string, userId: string): Promise<ReservationRead> {
    return this.databaseService.reservation.update({
      where: { id: reservationId, userId: userId },
      data: { status: 'CANCELLED' },
    });
  }

  async update(
    reservation: Partial<ReservationRead> & { id: string },
  ): Promise<ReservationRead> {
    const result = await this.databaseService.reservation.update({
      where: { id: reservation.id },
      data: reservation,
    });

    await this.notificationService.create(
      result.userId,
      'Status update',
      `Your reservation status has been updated to ${result.status}`,
    );

    return result;
  }

  delete(reservationId: string): Promise<ReservationRead> {
    return this.databaseService.reservation.delete({
      where: { id: reservationId },
    });
  }
}

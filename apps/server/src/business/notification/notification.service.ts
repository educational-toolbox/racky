import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class NotificationService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(userId: string, title: string, message?: string) {
    return this.databaseService.notification.create({
      data: {
        userId: userId,
        title: title,
        message: message ?? '',
      },
    });
  }

  getForUser(userId: string) {
    return this.databaseService.notification.findMany({
      where: {
        userId: userId,
        read: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  markAsRead(notificationId: string) {
    return this.databaseService.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        read: true,
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '~/database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly database: DatabaseService) {}
  getOne(userId: string) {
    return this.database.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        email: true,
        firstName: true,
        id: true,
        lastName: true,
        organizationId: true,
        ownsId: true,
        password: false,
      },
    });
  }
}

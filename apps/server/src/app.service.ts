import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { env } from './server-env';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(private readonly database: DatabaseService) {}
  getHello(): string {
    return 'Hello Tom!';
  }
  async ensureDefaultOrgCreated() {
    const exists = await this.database.organization.findFirst({
      where: {
        id: env.NEXT_PUBLIC_DEFAULT_ORGANIZATION_ID,
      },
    });
    if (exists) {
      this.logger.log('Default organization already exists');
      return exists;
    }
    this.logger.log('Creating default organization');
    return this.database.organization.create({
      data: {
        id: env.NEXT_PUBLIC_DEFAULT_ORGANIZATION_ID,
        name: env.DEFAULT_ORGANIZATION_NAME,
        zone: env.DEFAULT_ORGANIZATION_ZONE,
      },
    });
  }
}

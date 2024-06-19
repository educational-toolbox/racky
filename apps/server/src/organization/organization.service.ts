import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class OrganizationService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create() {
    return this.databaseService.organization.create({
      data: {
        name: '',
        zone: '',
      },
    });
  }
}

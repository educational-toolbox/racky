import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class OrganizationService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAll() {
    return this.databaseService.organization.findMany();
  }

  async get(id: string) {
    return this.databaseService.organization.findUnique({
      where: { id },
    });
  }

  async create(name: string, zone: string) {
    return this.databaseService.organization.create({
      data: { name, zone },
    });
  }

  async edit(id: string, name: string, zone: string) {
    return this.databaseService.organization.update({
      where: { id },
      data: { name, zone },
    });
  }

  async addUser(organizationId: string, userId: string) {
    return this.databaseService.organization.update({
      where: { id: organizationId },
      data: { users: { connect: { id: userId } } },
    });
  }

  async removeUser(organizationId: string, userId: string) {
    return this.databaseService.organization.update({
      where: { id: organizationId },
      data: { users: { disconnect: { id: userId } } },
    });
  }

  async createInvite(email: string, organizationId: string) {
    return this.databaseService.organizationInvite.create({
      data: { email, organizationId },
    });
  }

  async checkInviteExistence(inviteId: string) {
    return this.databaseService.organizationInvite.findUnique({
      where: { id: inviteId, valid: true },
      select: { id: true },
    });
  }

  async validateInvite(inviteId: string) {
    return this.databaseService.organizationInvite.update({
      where: { id: inviteId, valid: true },
      data: { valid: false },
    });
  }
}

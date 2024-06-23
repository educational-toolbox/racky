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

  delete(ids: string[]) {
    return this.databaseService.organization.deleteMany({
      where: { id: { in: ids } },
    });
  }

  async addUser(organizationId: string, userId: string) {
    return this.databaseService.user.update({
      where: { id: userId },
      data: {
        organization: { connect: { id: organizationId } },
      },
    });
  }

  async getUsers(organizationId: string) {
    const users = await this.databaseService.organization
      .findUnique({ where: { id: organizationId } })
      .users();
    return users ?? [];
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

  async checkInviteExistence(inviteIdOrEmail: string) {
    return this.databaseService.organizationInvite.findFirst({
      where: {
        OR: [
          { id: inviteIdOrEmail, valid: true },
          { email: inviteIdOrEmail, valid: true },
        ],
      },
      select: { id: true, organization: { select: { name: true, id: true } } },
    });
  }

  async validateInvite(inviteId: string) {
    return this.databaseService.organizationInvite.update({
      where: { id: inviteId, valid: true },
      data: { valid: false },
    });
  }
}

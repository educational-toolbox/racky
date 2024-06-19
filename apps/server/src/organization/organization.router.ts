import { TrpcService } from '@educational-toolbox/racky-api/trpc/trpc.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrganizationRouter {
  constructor(private readonly trpc: TrpcService) {}

  router = this.trpc.router({});
}

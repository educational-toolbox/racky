import { Request } from 'express';
import { AuthService } from './auth.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    return this.canActivateFromRequest(req);
  }

  async canActivateFromRequest(context: Request): Promise<boolean> {
    const isAuthenticated = await this.authService.validate(context);
    return isAuthenticated;
  }
}

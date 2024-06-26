import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { clerkClient } from './clerk-client';

@Injectable()
export class ClerkAuthService extends AuthService {
  constructor(readonly _logger: Logger) {
    super(_logger);
  }

  authenticate(): Promise<boolean> {
    throw new Error('Clerk authentication happens on their end.');
  }

  async validate(request: Request): Promise<boolean> {
    const tokenFromCookie = request.cookies?.__session as string | undefined;
    const tokenFromHeader = request.headers.authorization;

    const token = tokenFromHeader ? tokenFromHeader : tokenFromCookie;
    if (token === undefined) {
      return false;
    }

    try {
      let cleanedToken = token;
      if (token.startsWith('Bearer ')) {
        cleanedToken = token.slice(7);
      }
      const decoded = await clerkClient.verifyToken(cleanedToken);
      if (decoded.exp < Math.floor(Date.now() / 1000)) {
        return false;
      }
      if (decoded.nbf > Math.floor(Date.now() / 1000)) {
        return false;
      }
    } catch (_err) {
      this._logger.error('Error validating clerk token', _err);
      return false;
    }

    return true;
  }

  async getUserId(req: Request): Promise<string | undefined> {
    try {
      const token = req.headers.authorization?.slice(7);
      if (!token) return undefined;
      return (await clerkClient.verifyToken(token)).sub;
    } catch (error) {
      return undefined;
    }
  }
}

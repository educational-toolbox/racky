import type { Logger } from '@nestjs/common';
import type { Request } from 'express';

export abstract class AuthService {
  constructor(protected readonly _logger: Logger) {}
  abstract authenticate(
    _username: string,
    _password: string,
  ): boolean | Promise<boolean>;
  abstract validate(request: Request): boolean | Promise<boolean>;
  abstract getUserId(
    request: Request,
  ): string | undefined | Promise<string | undefined>;
}

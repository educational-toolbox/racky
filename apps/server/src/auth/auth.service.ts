import { Request } from 'express';

export abstract class AuthService {
  abstract authenticate(
    _username: string,
    _password: string,
  ): boolean | Promise<boolean>;
  abstract validate(request: Request): boolean | Promise<boolean>;
}

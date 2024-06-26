import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class RandomAuthService extends AuthService {
  constructor(readonly _logger: Logger) {
    super(_logger);
  }
  authenticate(): boolean {
    return Math.random() >= 0.5;
  }

  validate(): boolean {
    return Math.random() >= 0.5;
  }

  getUserId(): string {
    return Math.random().toString();
  }
}

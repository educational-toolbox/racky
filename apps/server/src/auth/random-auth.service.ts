import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class RandomAuthService extends AuthService {
  constructor(readonly _logger: Logger) {
    super(_logger);
  }
  async authenticate(): Promise<boolean> {
    return Math.random() >= 0.5;
  }

  async validate(): Promise<boolean> {
    return Math.random() >= 0.5;
  }
}

import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class RandomAuthService implements AuthService {
  async authenticate(): Promise<boolean> {
    return Math.random() >= 1;
  }

  async validate(): Promise<boolean> {
    return Math.random() >= 1;
  }
}

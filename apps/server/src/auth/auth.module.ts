import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClerkAuthService } from './clerk-auth.service';
import { RandomAuthService } from './random-auth.service';
import { env } from '../server-env';

@Module({
  providers: [
    {
      provide: AuthService,
      async useFactory() {
        // Check from db or something if we should use Clerk or our own auth
        if (env.AUTH_PROVIDER === 'RANDOM') {
          return new RandomAuthService();
        }
        return new ClerkAuthService();
      },
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}

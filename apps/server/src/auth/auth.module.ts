import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClerkAuthService } from './clerk-auth.service';
import { RandomAuthService } from './random-auth.service';
import { env } from '../server-env';
import { AuthenticatedGuard } from './authenticated.guard';

@Module({
  providers: [
    AuthenticatedGuard,
    {
      provide: AuthService,
      async useFactory() {
        // Check from db or something if we should use Clerk or our own auth
        console.log(`using "${env.AUTH_PROVIDER}" provider`);
        const logger = new Logger('AuthService');
        if (env.AUTH_PROVIDER === 'unsafe_random') {
          return new RandomAuthService(logger);
        }
        return new ClerkAuthService(logger);
      },
    },
  ],
  exports: [AuthService, AuthenticatedGuard],
})
export class AuthModule {}

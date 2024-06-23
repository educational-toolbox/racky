import { Module } from '@nestjs/common';
import { UserRouter } from './user.router';
import { UserService } from './user.service';

@Module({
  providers: [UserRouter, UserService],
  exports: [UserRouter],
})
export class UsersModule {}

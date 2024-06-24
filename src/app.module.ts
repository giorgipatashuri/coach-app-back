import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MatchModule } from './match/match.module';

@Module({
  imports: [UserModule, AuthModule, MatchModule],
})
export class AppModule {}

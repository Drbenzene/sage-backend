import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';
import { DatabaseModule } from './database/Database.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './user/strategies/jwt.strategy';

@Module({
  imports: [
    UserModule,
    AccountModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule available globally
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}

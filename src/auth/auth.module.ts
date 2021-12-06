import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersRepository } from '../users/users.repository';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    TypeOrmModule.forFeature([UsersRepository]),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT'),
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
})
export class AuthModule {}

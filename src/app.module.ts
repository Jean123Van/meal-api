import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealsModule } from './meals/meals.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { DefaultMealsModule } from './default-meals/default-meals.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.STAGE}`],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        autoLoadEntities: true,
        // Recommended to disable when deploying to production.
        synchronize: true,
        logging: true,
      }),
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    MealsModule,
    DefaultMealsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

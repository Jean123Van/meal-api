import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DefaultMealsRepository } from 'src/default-meals/repository/default-meals.repository';
import { DailyMealPlanRepository } from 'src/meals/repository/daily-meal-plan.repository';
import { CommonMethods } from 'src/common-methods/common-methods';
import { HttpModule } from '@nestjs/axios';
import { MealRepository } from 'src/meals/repository/meal.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, CommonMethods],
  imports: [TypeOrmModule.forFeature([UsersRepository]),
            TypeOrmModule.forFeature([DefaultMealsRepository]),
            TypeOrmModule.forFeature([DailyMealPlanRepository]),
            TypeOrmModule.forFeature([MealRepository]),
            ConfigModule, HttpModule],
})
export class UsersModule {}

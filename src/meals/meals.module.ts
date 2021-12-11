import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealsController } from './meals.controller';
import { MealsService } from './meals.service';
import { DailyMealPlanRepository } from './repository/daily-meal-plan.repository';
import { MealRepository } from './repository/meal.repository';
import { HttpModule } from '@nestjs/axios'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonMethods } from 'src/common-methods/common-methods';
import { DefaultMealsRepository } from 'src/default-meals/repository/default-meals.repository';
import { UsersRepository } from 'src/users/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DailyMealPlanRepository]),
            TypeOrmModule.forFeature([MealRepository]),
            TypeOrmModule.forFeature([DefaultMealsRepository]),
            TypeOrmModule.forFeature([UsersRepository]),
            ConfigModule, HttpModule],
  controllers: [MealsController],
  providers: [MealsService, CommonMethods]
})
export class MealsModule {}

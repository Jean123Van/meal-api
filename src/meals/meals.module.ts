import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealsController } from './meals.controller';
import { MealsService } from './meals.service';
import { DailyMealPlanRepository } from './repository/daily-meal-plan.repository';
import { MealRepository } from './repository/meal.repository';
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [TypeOrmModule.forFeature([DailyMealPlanRepository]),
            TypeOrmModule.forFeature([MealRepository]),
            HttpModule],
  controllers: [MealsController],
  providers: [MealsService]
})
export class MealsModule {}

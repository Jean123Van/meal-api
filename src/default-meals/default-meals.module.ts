import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefaultMealsController } from './default-meals.controller';
import { DefaultMealsService } from './default-meals.service';
import { DefaultMealsRepository } from './repository/default-meals.repository';
import { HttpModule } from '@nestjs/axios'
import { CommonMethods } from 'src/common-methods/common-methods';
import { DailyMealPlanRepository } from 'src/meals/repository/daily-meal-plan.repository';
import { MealRepository } from 'src/meals/repository/meal.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DefaultMealsRepository]),
            TypeOrmModule.forFeature([DailyMealPlanRepository]),
            TypeOrmModule.forFeature([MealRepository]),
            HttpModule],
  controllers: [DefaultMealsController],
  providers: [DefaultMealsService, CommonMethods]
})
export class DefaultMealsModule {}

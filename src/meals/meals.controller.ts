import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  Headers,
  Param,
  Logger,
} from '@nestjs/common';
import { AddMeal } from './dto/add-meal.dto';
import { MealsService } from './meals.service';

@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Post('add')
  addMeal(@Body() addMeal: AddMeal, @Body() userId) {
    return this.mealsService.addMeal(addMeal, userId);
  }

  @Delete('delete')
  deleteMeal(@Body() mealId) {
    return this.mealsService.deleteMeal(mealId);
  }

  @Post('createMealPlan')
  createMealPlan(@Body() date, @Body() userId) {
    return this.mealsService.createMealPlan(date, userId);
  }

  @Get('getDailyMealPlan')
  getDailyMealPlan(@Body() date, @Body() userId) {
    return this.mealsService.getDailyMealPlan(date, userId);
  }

  @Get('getSpecificMealType')
  getSpecificMeals(@Body() mealType, @Body() userId) {
    return this.mealsService.getSpecificMeals(mealType, userId);
  }

  @Get('/searchMealsByKeyword/:keyword')
  searchMealsByKeyword(@Param('keyword') keyword: string) {
    Logger.log(`MealsController.searchMealsByKeyword(${keyword})`);
    return this.mealsService.searchByKeyword(keyword);
  }

  @Patch()
  editMeal() {}
}

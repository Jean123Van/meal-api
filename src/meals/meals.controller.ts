import { Body, Controller, Delete, Get, Patch, Post, Req, Headers, UseGuards, Param, Header, Query } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { filter } from 'rxjs';
import { Auth0Guard } from 'src/auth/auth0.guard';
import { Filter } from 'src/common/query-pagination.interface';
import { AddMeal } from './dto/add-meal.dto';
import { EditMealDto } from './dto/edit-meal.dto';
import { EditMealPlan } from './dto/edit-mealPlan.dto';
import { MealsService } from './meals.service';

@UseGuards(Auth0Guard)
@Controller('meals')
export class MealsController {
    constructor(private readonly mealsService:MealsService){}

    //adding new meal to database - finished
    @Post('add')
    addMeal(@Body() addMeal:AddMeal, @Headers() user){
        return this.mealsService.addMeal(addMeal,user.id)
    }

    //delete added meal from server - finished
    @Delete('delete')
    deleteMeal(@Headers() meal){
        return this.mealsService.deleteMeal(meal.id)
    }

    //creates a meal plan another day in the next week - finished
    @Timeout(1)
    createMealPlan(){
        this.mealsService.createMealPlan()
    }

    //gets the meal plan and nutrition for specific day - finished
    @Post('getDailyMealPlan')
    getDailyMealPlan(@Body() date, @Headers() user){
        return this.mealsService.getDailyMealPlan(date.date, user.id)
    }

    //return all meals/all breakfast/all lunch/all dinner with pagination of 5 per page - finished
    @Get('getSpecificMealType')
    getSpecificMeals(@Query() filter:Filter, @Headers() user){
        return this.mealsService.getSpecificMeals(filter,user.id)
    }

    //allows editing of meal details such as recipe, name, imageURL, ingredients, mealType - finished
    @Patch('editMealDetails')
    editMealDetails(@Body() editMeal:EditMealDto, @Headers() meal){
        return this.mealsService.editMealDetails(editMeal, meal.id)
    }

    //allows editing of daily meal plan such as deleting/replacing/adding of breakfast/lunch/dinner - finished
    @Patch('editDailyMealPlan')
    editDailyMealPlan(@Body() editDailyMealPlan:EditMealPlan, @Headers() header){
        return this.mealsService.editDailyMealPlan(editDailyMealPlan,header.mealplanid,header.userid)
    }

    //searches meals with a keyword (searches by title or ingredient) - finished
    @Get('searchMeals')
    searchMeals(@Query() filter, @Headers() user){
        return this.mealsService.searchMeals(filter,user.id)
    }

    @Get('filterMeals')
    filterMeals(@Query() filterParams, @Headers() user) {
        return this.mealsService.filterMeals(filterParams);
    }
}

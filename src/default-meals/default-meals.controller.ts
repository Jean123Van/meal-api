import { Body, Controller, Post } from '@nestjs/common';
import { AddMeal } from 'src/meals/dto/add-meal.dto';
import { DefaultMealsService } from './default-meals.service';

@Controller('default-meals')
export class DefaultMealsController {
    constructor(private readonly defaultMealsService: DefaultMealsService){}

    @Post()
    addDefaultMeal(@Body() addMeal:AddMeal){
        return this.defaultMealsService.addDefaultMeal(addMeal)
    }
}

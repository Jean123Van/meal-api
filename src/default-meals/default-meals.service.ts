import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { AddMeal } from 'src/meals/dto/add-meal.dto';
import { DefaultMealsRepository } from './repository/default-meals.repository';
import { HttpService } from '@nestjs/axios'
import { CommonMethods } from 'src/common-methods/common-methods';

@Injectable()
export class DefaultMealsService {
    constructor(private readonly defaultMealsRepository: DefaultMealsRepository,
                private readonly commonMethods:CommonMethods){}

    async addDefaultMeal(addMeal:AddMeal){

        const nutrients = await this.commonMethods.calcMealNutrition(addMeal)
        
        return this.defaultMealsRepository.save({...addMeal, ...nutrients})
    }
}

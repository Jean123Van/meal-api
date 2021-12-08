import { Injectable } from '@nestjs/common';
import { AddMeal } from './dto/add-meal.dto';
import { DailyMealPlanRepository } from './repository/daily-meal-plan.repository';
import { MealRepository } from './repository/meal.repository';
import { HttpService } from '@nestjs/axios'
import { lastValueFrom, map } from 'rxjs';
import { Any, In } from 'typeorm';

@Injectable()
export class MealsService {
    constructor(private readonly mealRepository:MealRepository,
                private readonly dailyMealPlanRepository:DailyMealPlanRepository,
                private readonly httpService:HttpService){}

    async addMeal(addMeal:AddMeal, userId){

        const {ingredients} = addMeal
        let allIngredients='';

        ingredients.map((a)=>{
            allIngredients += a + ' '
        })

        const info = await lastValueFrom(this.httpService.get(`https://api.calorieninjas.com/v1/nutrition?query=${allIngredients}`, {headers:{'X-Api-Key': 'eyjsQXF1lTy9nC1n5DJcmg==NWKXyzOp9BjEsPvI'}})
        .pipe(
            map((response) => (response.data.items))
        ))

        let protein = 0
        let carbohydrates = 0
        let calories = 0

        info.map((a)=>{
            protein += a.protein_g;
            carbohydrates += a.carbohydrates_total_g;
            calories += a.calories
        })

        return this.mealRepository.save({...addMeal,...userId, protein, carbohydrates, calories})
    }

    deleteMeal(mealId){
        ({mealId} = mealId)
        return this.mealRepository.delete({id:mealId})
    }

    async createMealPlan(date,userId){
        const allMeals = await this.mealRepository.find()
        let total = allMeals.length
        let [breakfast] = allMeals.splice(Math.floor(total*Math.random()),1)
        total = allMeals.length
        let [lunch] = allMeals.splice(Math.floor(total*Math.random()),1)
        total = allMeals.length
        let [dinner] = allMeals.splice(Math.floor(total*Math.random()),1)
        return this.dailyMealPlanRepository.save({...date,breakfast:breakfast.id,lunch:lunch.id,dinner:dinner.id,...userId});
    }

    async getDailyMealPlan(date,userId){
        ({date,userId}=date)
    
        const [mealPlan] = await this.dailyMealPlanRepository.find({date:new Date(date),userId})

        return {breakfast: await this.mealRepository.findOne({id:mealPlan.breakfast}),
                lunch: await this.mealRepository.findOne({id:mealPlan.lunch}),
                dinner: await this.mealRepository.findOne({id:mealPlan.dinner})}

    }

    async getSpecificMeals(mealType,userId){
        ({mealType,userId} = mealType)
        const meal = await this.mealRepository.find({userId})

        let chosenMeal = []

        meal.map((a)=>{
            if(a.mealType.includes(mealType)){
                chosenMeal.push(a)
            }
        })
        
        return chosenMeal
    }

}

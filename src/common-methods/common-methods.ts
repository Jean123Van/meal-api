import { lastValueFrom, map } from "rxjs";
import { AddMeal } from "src/meals/dto/add-meal.dto";
import { HttpService } from '@nestjs/axios'
import { Injectable } from "@nestjs/common";
import { DefaultMealsRepository } from "src/default-meals/repository/default-meals.repository";
import { DailyMealPlanRepository } from "src/meals/repository/daily-meal-plan.repository";
import { MealRepository } from "src/meals/repository/meal.repository";

@Injectable()
export class CommonMethods {
    constructor(private readonly httpService:HttpService,
                private readonly defaultMealsRepository:DefaultMealsRepository,
                private readonly dailyMealPlanRepository:DailyMealPlanRepository,
                private readonly mealRepository:MealRepository){}

    async calcMealNutrition(addMeal){

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

        protein = Math.round(protein*100)/100
        carbohydrates = Math.round(carbohydrates*100)/100
        calories = Math.round(calories*100)/100

        return {protein,carbohydrates,calories}
    }   


    async createMealPlan(i,userId){
        let date = new Date()
    
        let allDefaultMeals = await this.defaultMealsRepository.find()
        let categorizedMeals = {}

        allDefaultMeals.map((a) => {
        if(!categorizedMeals[a.mealType[0]]){
            categorizedMeals[a.mealType[0]]=[a]
        } else {
            categorizedMeals[a.mealType[0]].push(a)
        }
        })

        if(i===6){
            let allMeals = await this.mealRepository.find({userId})

            allMeals.map((a)=>{
                a.mealType.map((b)=>{
                    if(!categorizedMeals[b]){
                        categorizedMeals[b]=[a]
                    } else {
                        categorizedMeals[b].push(a)
                    }
                })
            })
        }

        while(i<7){

        let stringDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate() + i}`

        let breakfast = categorizedMeals["breakfast"][Math.floor(Math.random()*categorizedMeals["breakfast"].length)]
        let lunch = categorizedMeals["lunch"][Math.floor(Math.random()*categorizedMeals["lunch"].length)]
        let dinner = categorizedMeals["dinner"][Math.floor(Math.random()*categorizedMeals["dinner"].length)]
        
        this.dailyMealPlanRepository.save({date:stringDate,breakfast:breakfast.id,lunch:lunch.id,dinner:dinner.id,userId:userId})
        i++
        }
    }
}
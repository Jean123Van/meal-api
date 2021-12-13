import { Injectable, Logger } from '@nestjs/common';
import { AddMeal } from './dto/add-meal.dto';
import { DailyMealPlanRepository } from './repository/daily-meal-plan.repository';
import { MealRepository } from './repository/meal.repository';
import { CommonMethods } from 'src/common-methods/common-methods';
import { CronJob } from 'cron';
import { UsersRepository } from 'src/users/users.repository'
import { identity } from 'rxjs';
import { DefaultMealsRepository } from 'src/default-meals/repository/default-meals.repository';
import { Filter } from 'src/common/query-pagination.interface';
import { EditMealDto } from './dto/edit-meal.dto';
import { EditMealPlan } from './dto/edit-mealPlan.dto';

@Injectable()
export class MealsService {
    constructor(private readonly mealRepository:MealRepository,
                private readonly dailyMealPlanRepository:DailyMealPlanRepository,
                private readonly commonMethods:CommonMethods,
                private readonly usersRepository:UsersRepository,
                private readonly defaultMealsRepository:DefaultMealsRepository){}

    async addMeal(addMeal:AddMeal, userId){

        const nutrients = await this.commonMethods.calcMealNutrition(addMeal)

        return this.mealRepository.save({...addMeal, userId, ...nutrients})
    }

    deleteMeal(mealId){
        return this.mealRepository.delete({id:mealId})
    }

    async createMealPlan(){

        const users = this.usersRepository
        const commonMethods = this.commonMethods

        const value = new CronJob("0 0 0 * * *", async function(){
            let allUsers = await users.find()

            allUsers.map((a)=>{
                commonMethods.createMealPlan(6,a.user_id)
            })
        })
        value.start()
    }

    async getDailyMealPlan(date,userId){

        const [mealPlan] = await this.dailyMealPlanRepository.find({date:date,userId})
        let id = mealPlan.id
        
        let tempBreakfast = await this.mealRepository.findOne({id:mealPlan.breakfast}) as Object
            if(!tempBreakfast){
                tempBreakfast = await this.defaultMealsRepository.findOne({id:mealPlan.breakfast})
            }
        let breakfast = await format(tempBreakfast)

        let tempLunch = await this.mealRepository.findOne({id:mealPlan.lunch}) as Object
            if(!tempLunch){
                tempLunch = await this.defaultMealsRepository.findOne({id:mealPlan.lunch})
            }
        let lunch = await format(tempLunch)

        let tempDinner = await this.mealRepository.findOne({id:mealPlan.dinner}) as Object
            if(!tempDinner){
                tempDinner = await this.defaultMealsRepository.findOne({id:mealPlan.dinner})
            }
        let dinner = await format(tempDinner)

        return {id, breakfast, lunch, dinner}

        async function format(object){
            let {mealName, mealImage, recipe, ingredients, protein, carbohydrates, calories} = object
            return {mealName, mealImage, recipe, ingredients, protein, carbohydrates, calories}
        }
    }

    async getSpecificMeals(filter,userId){
        let {q,page=1,per_page=5} = filter
        per_page = Number(per_page)
        page = Number(page)
        
        const meal = await this.mealRepository.find({userId})
        const defaultMeals = await this.defaultMealsRepository.find()

        if(q!=='all'){
            let chosenMeal = []
            
            meal.map((a)=>{
                if(a.mealType.includes(q)){
                    chosenMeal.push(a)
                }
            })
            defaultMeals.map((a)=>{
                if(a.mealType.includes(q)){
                    chosenMeal.push(a)
                }
            })
            return chosenMeal.slice((page-1)*per_page,per_page+((page-1)*per_page))
        } 
        return [meal,defaultMeals].flat().slice((page-1)*per_page,per_page+((page-1)*per_page))
    }

    async editMealDetails(editMeal,mealId){
        const nutrients = await this.commonMethods.calcMealNutrition(editMeal)
        return this.mealRepository.update({id:mealId},{...editMeal,...nutrients})
    }

    async editDailyMealPlan(editDailyMealPlan:EditMealPlan, mealPlanId, userId){
        const {action, toUpdate} = editDailyMealPlan
        let update = {}
        if(action === 'delete'){
            switch (toUpdate){
                case 'breakfast':
                    update = {breakfast:null}
                    break;
                case 'lunch':
                    update = {lunch:null}
                    break;
                case 'dinner':
                    update = {dinner:null}
                    break;
            }
            this.dailyMealPlanRepository.update({id:mealPlanId},update)
        }

        if(action === 'update'){

            const meal = await this.mealRepository.find({userId})
            const defaultMeals = await this.defaultMealsRepository.find()

            let chosenMeal = []
            
            meal.map((a)=>{
                if(a.mealType.includes(toUpdate)){
                    chosenMeal.push(a)
                }
            })
            defaultMeals.map((a)=>{
                if(a.mealType.includes(toUpdate)){
                    chosenMeal.push(a)
                }
            })
            let update = {}
            let newMeal = chosenMeal[Math.floor(Math.random()*chosenMeal.length)].id

            switch (toUpdate){
                case 'breakfast':
                    update = {breakfast:newMeal}
                    break;
                case 'lunch':
                    update = {lunch:newMeal}
                    break;
                case 'dinner':
                    update = {dinner:newMeal}
                    break;
            }

            return this.dailyMealPlanRepository.update({id:mealPlanId},update)
        }
    }



    async searchMeals(filter,userId){
        let {q, per_page=5 ,page=1 } = filter
        per_page = Number(per_page)
        page = Number(page)

        const meals = await this.mealRepository.find({userId})
        const defaultMeals = await this.defaultMealsRepository.find()
        const allMeals = [meals,defaultMeals].flat()
        const regex = new RegExp(q,"im")

        let value =  allMeals.filter((a)=>{
            let string = a.mealName + a.recipe + a.ingredients.toString()
            if(regex.test(string)){
                return a
            }
        })

        return value.slice((page-1)*per_page,per_page+((page-1)*per_page))
    }
}

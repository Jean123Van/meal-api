import { EntityRepository, Repository } from "typeorm";
import { DailyMealPlanEntity } from "../entity/daily-meal-plan.entity";

@EntityRepository(DailyMealPlanEntity)
export class DailyMealPlanRepository extends Repository<DailyMealPlanEntity>{}
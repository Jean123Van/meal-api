import { EntityRepository, Repository } from "typeorm";
import { MealEntity } from "../entity/meal.entity";

@EntityRepository(MealEntity)
export class MealRepository extends Repository<MealEntity>{}
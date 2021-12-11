import { EntityRepository, Repository } from "typeorm";
import { DefaultMeals } from "../entity/default-meals.entity";

@EntityRepository(DefaultMeals)
export class DefaultMealsRepository extends Repository<DefaultMeals>{}
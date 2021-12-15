import { EntityRepository, Repository } from 'typeorm';
import { MealEntity } from '../entity/meal.entity';
import { getManager } from 'typeorm';
import { Logger } from '@nestjs/common';

@EntityRepository(MealEntity)
export class MealRepository extends Repository<MealEntity> {
  /*
	SELECT *
	FROM MEALS
	WHERE 'banana' = ANY(INGREDIENTS);
	*/
  async searchByKeyword(keyword: string) {
    const result = await getManager().query(`SELECT *
	FROM MEALS
	WHERE '${keyword}' = ANY(INGREDIENTS)
	OR MEALNAME ILIKE '%${keyword}%';`);
    Logger.log(`MealRepository.searchByKeyword\n`, result);

    return result;
  }
}

import { EntityRepository, Repository } from "typeorm";
import { RestaurantEntity } from "../entity/restaurant.entity";

@EntityRepository(RestaurantEntity)
export class RestaurantRepository extends Repository<RestaurantEntity>{
    
}
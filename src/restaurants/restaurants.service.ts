import { Injectable } from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AddRestaurant } from './dto/add-restaurant.dto';
import { UpdateRestaurant } from './dto/update-restaurant.dto';
import { RestaurantEntity } from './entity/restaurant.entity';
import { RestaurantRepository } from './repository/restaurant.repository';

@Injectable()
export class RestaurantsService {
    constructor(private readonly restaurantRepository:RestaurantRepository){}

    addRestaurant(addRestaurant:AddRestaurant, userId): Promise<RestaurantEntity>{
        return this.restaurantRepository.save({...addRestaurant,...userId})
    }

    getAllRestaurants(userId): Promise<RestaurantEntity[]>{
        return this.restaurantRepository.find(userId)
    }

    deleteRestaurant(restaurantId): Promise<DeleteResult>{
         ({restaurantId} = restaurantId)
        return this.restaurantRepository.delete({id:restaurantId})
    }

    updateRestaurant(updateRestaurant:UpdateRestaurant): Promise<UpdateResult>{
        const {id} = updateRestaurant
        delete updateRestaurant.id
        return this.restaurantRepository.update({id},{...updateRestaurant})
    }
}

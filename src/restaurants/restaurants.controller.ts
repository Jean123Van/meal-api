import { Body, Controller, Delete, Patch, Post } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { AddRestaurant } from './dto/add-restaurant.dto';
import { UpdateRestaurant } from './dto/update-restaurant.dto';
import { RestaurantEntity } from './entity/restaurant.entity';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
    constructor(private readonly restaurantsService:RestaurantsService){}

    @Post('add')
    addRestaurant(@Body() addRestaurant: AddRestaurant, @Body() userId){
        return this.restaurantsService.addRestaurant(addRestaurant, userId)
    }

    @Post('all')
    getAllRestaurants(@Body() userId){
        return this.restaurantsService.getAllRestaurants(userId)
    }

    @Delete('delete')
    deleteRestaurant(@Body() restaurantId){
        return this.restaurantsService.deleteRestaurant(restaurantId)
    }

    @Patch('update')
    updateRestaurant(@Body() updateRestaurant:UpdateRestaurant){
        return this.restaurantsService.updateRestaurant(updateRestaurant)
    }

}

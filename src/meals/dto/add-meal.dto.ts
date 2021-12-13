import { IsNotEmpty, IsOptional } from "class-validator";

export class AddMeal {

    @IsNotEmpty()
    mealName:string;

    @IsOptional()
    mealImage?:string;

    @IsOptional()
    recipe?:string;

    @IsOptional()
    ingredients?

    @IsNotEmpty()
    mealType
}
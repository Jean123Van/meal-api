import { IsNotEmpty, IsOptional } from "class-validator";

export class EditMealDto{
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
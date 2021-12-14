import { IsOptional, IsArray, IsNumberString, IsString } from "class-validator";

export class MealSearchDto {
    // @IsArray()
    // keywords: string[];
    keyword: string;

    @IsString()
    @IsOptional()
    meal_type?: string;

    @IsOptional()
    @IsNumberString()
    page_size?: string;

    @IsOptional()
    @IsNumberString()
    page_number?: string;
}

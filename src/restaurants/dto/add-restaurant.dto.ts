import { IsNotEmpty, IsOptional } from "class-validator";

export class AddRestaurant {

    @IsNotEmpty()
    name: string;

    @IsOptional()
    imageURL: string;

    @IsOptional()
    addressId: string;
}
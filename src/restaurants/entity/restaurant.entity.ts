import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('restaurants')
export class RestaurantEntity{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name:string;

    @Column({nullable:true})
    imageURL:string;

    @Column({nullable:true})
    addressId:string;

}
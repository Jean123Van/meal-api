import { IsOptional } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('default meals')
export class DefaultMeals {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    mealName:string;

    @Column({nullable:true})
    mealImage:string;

    @Column({nullable:true})
    recipe:string;

    @Column({type: "jsonb", nullable:true})
    ingredients:string[]

    @Column({type:'numeric'})
    protein: number;

    @Column({type:'numeric'})
    carbohydrates: number;

    @Column({type:'numeric'})
    calories: number;

    @Column({type:"jsonb"})
    mealType: string[]
}

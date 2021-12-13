
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { MealEntity } from "./meal.entity";

@Entity('meal plans')
export class DailyMealPlanEntity {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    userId:string;

    @Column()
    date:string;

    @Column({nullable:true})
    breakfast: string;

    @Column({nullable:true})
    lunch: string;

    @Column({nullable:true})
    dinner: string;
}
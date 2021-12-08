
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { MealEntity } from "./meal.entity";

@Entity('meal plans')
export class DailyMealPlanEntity {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    userId:string;

    @Column()
    date:Date;

    @Column()
    breakfast: string;

    @Column()
    lunch: string;

    @Column()
    dinner: string;
}
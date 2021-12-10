import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('meals')
export class MealEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  mealname: string;

  @Column()
  mealImage: string;

  @Column()
  recipe: string;

  @Column({ array: true })
  ingredients: string;

  @Column({ type: 'numeric' })
  protein: number;

  @Column({ type: 'numeric' })
  carbohydrates: number;

  @Column({ type: 'numeric' })
  calories: number;

  @Column({ array: true })
  mealType: string;
}

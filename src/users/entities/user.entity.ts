import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column()
  username: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  age?: string;

  @Column({ nullable: true })
  avatar_url?: string;
}

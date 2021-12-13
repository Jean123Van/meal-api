import { Logger } from '@nestjs/common';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersEntity } from './entities/user.entity';

import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { PaginationOptions } from '../common/pagination-options.interface';
import { DailyMealPlanRepository } from 'src/meals/repository/daily-meal-plan.repository';
import { MealRepository } from 'src/meals/repository/meal.repository';
import { DefaultMealsRepository } from 'src/default-meals/repository/default-meals.repository';
import { CommonMethods } from 'src/common-methods/common-methods';
import { CronJob } from 'cron';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository,
              private readonly commonMethods:CommonMethods){}

  async register(createUserDto: CreateUserDto) {

    
    const salt = await bcrypt.genSalt();
    const hashedPassword = bcrypt.hashSync(createUserDto.password, salt);
    createUserDto.password = hashedPassword;
    const { email, user_id } = await this.usersRepository.register(createUserDto);

    this.commonMethods.createMealPlan(0,user_id)

    return email
  }

  findAll(paginationOptions: PaginationOptions): Promise<UsersEntity[]> {
    return this.usersRepository.find({
      select: [
        'user_id',
        'first_name',
        'last_name',
        'email',
        'avatar_url',
        'age',
      ],
      skip: Number(paginationOptions.page) * Number(paginationOptions.per_page),
      take: Number(paginationOptions.per_page),
    });
  }

  findOne(uid: string): Promise<UsersEntity> {
    return this.usersRepository.findOne({ user_id: uid });
  }

  update(uid: string, updateUserDto: UpdateUserDto): Promise<UsersEntity> {
    this.usersRepository.update(uid, updateUserDto);
    return this.findOne(uid);
  }

  remove(id: string) {
    return this.usersRepository.delete({ user_id: id });
  }
}

import { Logger } from '@nestjs/common';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersEntity } from './entities/user.entity';

import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { PaginationOptions } from '../common/pagination-options.interface';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findAll(paginationOptions: PaginationOptions): Promise<UsersEntity[]> {
    return this.usersRepository.find({
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
    return `This action removes a #${id} user`;
  }
}

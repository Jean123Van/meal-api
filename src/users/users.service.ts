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

  async register(createUserDto: CreateUserDto) {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = bcrypt.hashSync(createUserDto.password, salt);
      createUserDto.password = hashedPassword;
      const { first_name, last_name, email } = await this.usersRepository.save(
        createUserDto,
      );
      return String(email);
    } catch (err) {
      Logger.log('\nError saving user.\n', err);
      throw new HttpException(
        "We couldn't register you. Please try again.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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

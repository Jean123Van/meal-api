import { Logger } from '@nestjs/common';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersEntity } from './entities/user.entity';

import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UsersEntity> {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
      createUserDto.password = hashedPassword;
      return await this.usersRepository.save(createUserDto);
    } catch (err) {
      Logger.log('\nError saving user.\n', err);
      throw new HttpException(
        "We couldn't register you. Please try again.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll(): Promise<UsersEntity[]> {
    return this.usersRepository.find();
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

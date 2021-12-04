import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersRepository } from '../users/users.repository';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async login(loginDto: LoginDto) {
    const identifier = loginDto.identifier;
    const searchResults = await this.usersRepository.find({
      where: [{ username: identifier }, { email: identifier }],
    });
    if (searchResults.length == 0) {
      Logger.log('Invalid username/email.', identifier);
      throw new HttpException('Invalid login details.', HttpStatus.BAD_REQUEST);
    }

    const foundPassword = searchResults[0].password;
    const passwordMatch = await bcrypt.compare(
      loginDto.password,
      foundPassword,
    );
    if (!passwordMatch) {
      Logger.log('Invalid password.', loginDto.password);
      throw new HttpException('Invalid login details.', HttpStatus.BAD_REQUEST);
    }
  }
}

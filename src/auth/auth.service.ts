import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersRepository } from '../users/users.repository';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, Observable, pluck } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = bcrypt.hashSync(createUserDto.password, salt);
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
      Logger.log('Invalid password.', {
        compareResult: passwordMatch,
        input: loginDto.password,
        expected: foundPassword,
      });
      throw new HttpException('Invalid login details.', HttpStatus.BAD_REQUEST);
    } else {
      return await this.requestApiToken();
    }
  }

  async requestApiToken(): Promise<any> {
    const result = await lastValueFrom(
      this.httpService
        .post(
          'https://dev-u258ijll.jp.auth0.com/oauth/token',
          {
            client_id: this.configService.get('AUTH0_CLIENT_ID'),
            client_secret: this.configService.get('AUTH0_CLIENT_SECRET'),
            audience: this.configService.get('AUTH0_AUDIENCE'),
            grant_type: 'client_credentials',
          },
          {
            headers: { 'content-type': 'application/json' },
          },
        )
        .pipe(pluck('data')),
    );

    return result;
  }
}

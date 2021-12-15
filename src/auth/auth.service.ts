import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersRepository } from '../users/users.repository';
import * as bcrypt from 'bcrypt';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, pluck } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

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
      let result = await this.requestApiToken();
      const { username, first_name, last_name, user_id, email, avatar_url } = searchResults[0];
      result.username = username;
      result.first_name = first_name;
      result.last_name = last_name;
      result.avatar_url = avatar_url;
      result.user_id = user_id;
      result.email = email;
      
      return result;
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

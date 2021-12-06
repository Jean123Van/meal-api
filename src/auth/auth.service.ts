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
      Logger.log('Auth0 Request Result', await this.requestApiToken());
      return {
        token:
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImVhR081QTVPV1NsQVpDTlBpMk9KbiJ9.eyJpc3MiOiJodHRwczovL2Rldi11MjU4aWpsbC5qcC5hdXRoMC5jb20vIiwic3ViIjoiTUV6ZzhSZjVsMUY4RXVzZ1NXZGs2bktCQUYxWnUwcklAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vbWVhbC1wbGFubmVyLyIsImlhdCI6MTYzODc1ODU2MCwiZXhwIjoxNjM4ODQ0OTYwLCJhenAiOiJNRXpnOFJmNWwxRjhFdXNnU1dkazZuS0JBRjFadTBySSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.jKa8YXLI9pEVtK5GKqmhjBNSItfcW6Oxhq1YD_lsMXoneTQUJkWeEWo1ue3XGThbBCvZZe0FASajiNwgmaJj8nFAO8b_SYbRDTxJZJRU5Wu3kkPHX15nf8dxc66ei1ZLQL_ZagoV_sieAOnEEOhC0nW9MPAqG2uTVULw-wLGN_EwOKw-UFVq2VUmJqZvkbBf6bDW7mkmhl50OHDy4ncoaLPytrhD4gVB1ZSJA_ahWLBGf15SzojDs2ClEDJ1D6RMOsb-Zlf86n5A2oHEJZ0oE_6j0a88yZ1TUc8ZB1UkNJmN3Zo9yNPHKQfeCKZcxvN0t42YpGNlk8G274tc9HIngA',
        type: 'Bearer',
      };
    }
  }

  async requestApiToken(): Promise<any> {
    // const result = await lastValueFrom(
    //   this.httpService
    //     .post(
    //       'https://dev-u258ijll.jp.auth0.com/oauth/token',
    //       {
    //         client_id: 'MEzg8Rf5l1F8EusgSWdk6nKBAF1Zu0rI',
    //         client_secret:
    //           'maWnK-1CexJDm0SxMBgZZcEpbStIF3tVEnYQA4rRFlmH4fUDdKteXh3YYdQdbd_n',
    //         audience: 'https://meal-planner/',
    //         // grant_type: 'client_credentials',
    //       },
    //       {
    //         headers: { 'content-type': 'application/json' },
    //       },
    //     )
    //     .pipe(pluck('data')),
    // );

    const axios = require('axios');
    const options = {
      method: 'POST',
      url: 'https://dev-u258ijll.jp.auth0.com/oauth/token',
      headers: {
        'content-type': 'application/json',
        authorization:
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImVhR081QTVPV1NsQVpDTlBpMk9KbiJ9.eyJpc3MiOiJodHRwczovL2Rldi11MjU4aWpsbC5qcC5hdXRoMC5jb20vIiwic3ViIjoiTUV6ZzhSZjVsMUY4RXVzZ1NXZGs2bktCQUYxWnUwcklAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vbWVhbC1wbGFubmVyLyIsImlhdCI6MTYzODc1ODU2MCwiZXhwIjoxNjM4ODQ0OTYwLCJhenAiOiJNRXpnOFJmNWwxRjhFdXNnU1dkazZuS0JBRjFadTBySSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.jKa8YXLI9pEVtK5GKqmhjBNSItfcW6Oxhq1YD_lsMXoneTQUJkWeEWo1ue3XGThbBCvZZe0FASajiNwgmaJj8nFAO8b_SYbRDTxJZJRU5Wu3kkPHX15nf8dxc66ei1ZLQL_ZagoV_sieAOnEEOhC0nW9MPAqG2uTVULw-wLGN_EwOKw-UFVq2VUmJqZvkbBf6bDW7mkmhl50OHDy4ncoaLPytrhD4gVB1ZSJA_ahWLBGf15SzojDs2ClEDJ1D6RMOsb-Zlf86n5A2oHEJZ0oE_6j0a88yZ1TUc8ZB1UkNJmN3Zo9yNPHKQfeCKZcxvN0t42YpGNlk8G274tc9HIngA',
      },
      body: '{"client_id":"MEzg8Rf5l1F8EusgSWdk6nKBAF1Zu0rI","client_secret":"maWnK-1CexJDm0SxMBgZZcEpbStIF3tVEnYQA4rRFlmH4fUDdKteXh3YYdQdbd_n","audience":"https://meal-planner/","grant_type":"client_credentials"}',
    };
    const result = axios(options);

    return result;
  }
}

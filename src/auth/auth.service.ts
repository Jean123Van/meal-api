import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  create(loginDto: LoginDto) {
    return 'This action adds a new auth';
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }
}

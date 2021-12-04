import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  identifier: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  username?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  email?: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

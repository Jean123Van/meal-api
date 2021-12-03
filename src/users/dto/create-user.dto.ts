import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Username should not be empty.' })
  @MinLength(4, { message: 'Minimum username length is four (4) characters.' })
  @MaxLength(20, {
    message: 'Maximum username length is twenty (20) characters.',
  })
  @Matches(/[.a-zA-Z 0-9\-_]{1,20}/, {
    message:
      'Username must be alpha-numeric with spaces, dashes, or underscores.',
  })
  @Matches(/^[.a-z A-Z_0-9\-]+$/, {
    message:
      'Username may only have alpha-numeric characters, dashes, spaces, and periods.',
  })
  username: string;

  @IsNotEmpty({ message: 'Name should not be empty.' })
  @Matches(/^[a-z A-Z\-]+$/, {
    message:
      'First name may only have alphabetic characters, dashes, and spaces.',
  })
  @MaxLength(64, { message: 'Name maximum length is sixty (64) characters.' })
  first_name: string;

  @IsNotEmpty({ message: 'Name should not be empty.' })
  @Matches(/^[a-z A-Z\-]+$/, {
    message: 'Surname may only have alphabetic characters, dashes, and spaces.',
  })
  @MaxLength(64, { message: 'Name maximum length is sixty (64) characters.' })
  last_name: string;

  @IsEmail()
  @MaxLength(32, {
    message: 'Email maximum length is thirty-two (32) characters.',
  })
  email: string;

  @IsNotEmpty({ message: 'Password cannot be empty.' })
  @MinLength(8, { message: 'Password minimum length is eight (8) characters.' })
  @MaxLength(32, {
    message: 'Password maximum length is thirty-two (32) characters.',
  })
  @Matches(/[a-z]+/, { message: 'Password must have a lowercase letter.' })
  @Matches(/[A-Z]+/, { message: 'Password must have an uppercase letter.' })
  @Matches(/[0-9]+/, { message: 'Password must have a number.' })
  @Matches(/[^a-zA-Z 0-9]+/, {
    message: 'Password must have a special character.',
  })
  password: string;

  @IsNumberString()
  @IsOptional()
  age?: string;

  @IsString()
  @IsOptional()
  avatar_url?: string;
}

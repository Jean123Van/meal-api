import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersEntity } from './entities/user.entity';

@EntityRepository(UsersEntity)
export class UsersRepository extends Repository<UsersEntity> {
  async register(createUserDto: CreateUserDto) {
    Logger.log('\nUsersRepository.register');

    const { username, email } = createUserDto;
    let error_strings = '';

    // START Section Check username, email are unique.
    const uname_search = this.findOne({ where: { username: username } });

    if ((await uname_search)?.username != undefined) {
      error_strings += '\nUsername must be unique.';
      Logger.log('\nUsername has duplicate.');
    }

    const email_search = this.findOne({ where: { email: email } });
    if ((await email_search)?.email != undefined) {
      error_strings += '\nEmail already registered.';
      Logger.log('\nEmail has duplicate.');
    }

    if (error_strings.length > 0) {
      throw new HttpException(error_strings, HttpStatus.BAD_REQUEST);
    }
    // END Section Check username...

    // START Section Save
    return await this.save(createUserDto)
      
    // END Section Save
  }
}

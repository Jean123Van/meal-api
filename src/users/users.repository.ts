import { EntityRepository, Repository } from 'typeorm';
import { UsersEntity } from './entities/user.entity';

@EntityRepository(UsersEntity)
export class UsersRepository extends Repository<UsersEntity> {}

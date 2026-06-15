import {Injectable, Inject} from '@nestjs/common';
import {User} from '../types/users.dto';
import type {Knex} from 'knex';

@Injectable()
export class UsersRepository {
  tableName = 'users';
  constructor(@Inject('KNEX_CONNECTION') private readonly knex: Knex) {}

  getById = async (id: number): Promise<User | null> => {
    const user = (await this.knex(this.tableName).where({id}).first()) as User;

    return user ?? null;
  };

  create = async (body: Omit<User, 'id'>): Promise<number | null> => {
    const [{id: newRecordId}] = (await this.knex(this.tableName)
      .insert(body)
      .returning('id')) as Pick<User, 'id'>[];

    return newRecordId;
  };
}

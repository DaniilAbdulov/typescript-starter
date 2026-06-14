import {Injectable, Inject} from '@nestjs/common';
import {User} from './types/users.dto';
import type {Knex} from 'knex';

@Injectable()
export class AppRepository {
  constructor(@Inject('KNEX_CONNECTION') private readonly knex: Knex) {}

  getById = async (id: number): Promise<User | null> => {
    const user = await this.knex('users').where({id}).first();

    return user ?? null;
  };

  create = async (body: Omit<User, 'id'>): Promise<number> => {
    const [{id: newRecordId}] = await this.knex('users')
      .insert(body)
      .returning('id');

    return newRecordId;
  };
}

// app.repository.ts
import {Injectable, Inject} from '@nestjs/common';
import {User} from './types/users.dto';
import type {Knex} from 'knex';

@Injectable()
export class AppRepository {
  constructor(@Inject('KNEX_CONNECTION') private readonly knex: Knex) {}

  getById = async (id: number) => {
    const user = (await this.knex('users')
      .where({id})
      .first()) as Promise<User | null>;

    return user ?? null;
  };
}

import {Test, TestingModule} from '@nestjs/testing';
import {Knex} from 'knex';
import {describe, beforeAll, afterAll, it, expect, jest} from '@jest/globals';
import {UsersController} from './controllers/users.controller';
import {UsersService} from './services/users.service';
import {ConfigModule} from '@nestjs/config';
import {KnexModule} from './modules/knex/knex.module';
import {RedisModule} from './modules/redis/redis.module';
import Redis from 'ioredis';
import {UsersRepository} from './repositories/users.repository';

describe('Users controller', () => {
  let app: TestingModule;
  let usersController: UsersController;
  let db: Knex;
  let cache: Redis;
  let usersRepository: UsersRepository;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, UsersRepository],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
        KnexModule,
        RedisModule,
      ],
    }).compile();

    usersController = app.get(UsersController);
    usersRepository = app.get(UsersRepository);

    db = app.get('KNEX_CONNECTION');
    cache = app.get('REDIS_CLIENT');
  });

  afterAll(async () => {
    await db('users').truncate();
    await cache.flushall();
    await cache.quit();
    await db.destroy();

    await app.close();
  });

  describe('users', () => {
    const USER = {
      id: 1,
      email: 'user@mail.ru',
      password_hash: 'ffff',
    };

    it('should create user', async () => {
      const newUserId = await usersController.create({
        email: 'user@mail.ru',
        password_hash: 'ffff',
      });

      expect(newUserId).toBe(USER.id);
    });

    it('should return User', async () => {
      const user = await usersController.getById(USER.id);

      expect(user).toStrictEqual({
        id: USER.id,
        email: USER.email,
        password_hash: USER.password_hash,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });

    it('should return User from cache without SQL query', async () => {
      const getByIdSpy = jest.spyOn(usersRepository, 'getById');

      const user = await usersController.getById(USER.id);

      expect(user).toStrictEqual({
        id: USER.id,
        email: USER.email,
        password_hash: USER.password_hash,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });
      expect(getByIdSpy).not.toHaveBeenCalled();
      getByIdSpy.mockRestore();
    });

    it('should return null', async () => {
      const user = await usersController.getById(787);

      expect(user).toBeNull();
    });

    it('try to create dublicate', async () => {
      let error: any;
      try {
        await usersController.create({
          email: 'user@mail.ru',
          password_hash: 'ffff',
        });
      } catch (exception) {
        error = exception;
      }

      expect(error.code).toBe('23505'); //dublicate
    });
  });
});

import {Test, TestingModule} from '@nestjs/testing';
import {Knex} from 'knex';
import {describe, beforeAll, afterAll, it, expect, jest} from '@jest/globals';
import {AppController} from './controllers/app.controller';
import {AppService} from './services/app.service';
import {AppRepository} from './repositories/app.repository';
import {ConfigModule} from '@nestjs/config';
import {KnexModule} from './modules/knex/knex.module';
import {RedisModule} from './modules/redis/redis.module';
import Redis from 'ioredis';

describe('AppController', () => {
  let app: TestingModule;
  let appController: AppController;
  let db: Knex;
  let cache: Redis;
  let appRepository: AppRepository;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, AppRepository],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
        KnexModule,
        RedisModule,
      ],
    }).compile();

    appController = app.get(AppController);
    appRepository = app.get(AppRepository);

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
      const newUserId = await appController.create({
        email: 'user@mail.ru',
        password_hash: 'ffff',
      });

      expect(newUserId).toBe(USER.id);
    });

    it('should return User', async () => {
      const user = await appController.getById(USER.id);

      expect(user).toStrictEqual({
        id: USER.id,
        email: USER.email,
        password_hash: USER.password_hash,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });

    it('should return User from cache without SQL query', async () => {
      const getByIdSpy = jest.spyOn(appRepository, 'getById');

      const user = await appController.getById(USER.id);

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
      const user = await appController.getById(787);

      expect(user).toBeNull();
    });

    it('try to create dublicate', async () => {
      let error: any;
      try {
        await appController.create({
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

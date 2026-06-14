import {Module, Global} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import Knex from 'knex';
import type {Knex as KnexType} from 'knex';
import {KnexService} from './knex.service';

const getConnection = (configService: ConfigService) => {
  const isTest = process.env.NODE_ENV === 'test';

  return {
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    user: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: isTest
      ? configService.get<string>('DB_DATABASE_FOR_TESTS')
      : configService.get<string>('DB_DATABASE'),
  };
};

@Global()
@Module({
  providers: [
    {
      provide: 'KNEX_CONNECTION',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<KnexType> => {
        const knex = Knex({
          client: 'pg',
          connection: getConnection(configService),
          debug: process.env.NODE_ENV !== 'production',
          pool: {
            min: 2,
            max: 10,
          },
        });

        try {
          await knex.raw('SELECT 1');
          console.log('✅ Database connected successfully');
        } catch (error) {
          console.error('❌ Database connection failed:', error);
          throw error;
        }

        return knex;
      },
    },
    KnexService,
  ],
  exports: ['KNEX_CONNECTION', KnexService],
})
export class KnexModule {}

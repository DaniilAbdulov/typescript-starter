import type {Knex} from 'knex';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const config: {[key: string]: Knex.Config} = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    migrations: {
      directory: path.join(__dirname, '/src/database/migrations'),
      extension: 'ts',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: path.join(__dirname, '/src/database/seeds'),
      extension: 'ts',
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, '/dist/database/migrations'),
      extension: 'js',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: path.join(__dirname, '/dist/database/seeds'),
      extension: 'js',
    },
  },
};

export default config;

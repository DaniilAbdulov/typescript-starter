import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {UsersService} from '../services/users.service';
import {RedisModule} from './redis/redis.module';
import {KnexModule} from './knex/knex.module';
import {UsersRepository} from '../repositories/users.repository';
import {UsersController} from '../controllers/users.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    KnexModule,
    RedisModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class AppModule {}

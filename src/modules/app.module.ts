import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AppController} from '../controllers/app.controller';
import {AppService} from '../services/app.service';
import {RedisModule} from './redis/redis.module';
import {KnexModule} from './knex/knex.module';
import {AppRepository} from '../repositories/app.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    KnexModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppRepository],
})
export class AppModule {}

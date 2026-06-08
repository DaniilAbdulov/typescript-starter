import {Module, Global} from '@nestjs/common';
import Redis from 'ioredis';
import {RedisService} from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const redisClient = new Redis({
          host: process.env.REDIS_HOST || '-',
          port: parseInt(process.env.REDIS_PORT || '-'),
          password: process.env.REDIS_PASSWORD,
          retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
          },
        });

        redisClient.on('connect', () => {
          console.log('✅ Redis connected successfully');
        });

        redisClient.on('error', (err) => {
          console.error('❌ Redis connection error:', err);
        });

        return redisClient;
      },
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}

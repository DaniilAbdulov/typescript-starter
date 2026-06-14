import {Injectable, Inject} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  get = async <T = unknown>(key: string): Promise<T | null> => {
    try {
      const val = await this.redisClient.get(key);

      if (!val) {
        return null;
      }

      return JSON.parse(val) as T;
    } catch {
      return null;
    }
  };

  set = async (key: string, val: any, ttl?: number): Promise<void> => {
    try {
      const serialized = JSON.stringify(val);
      if (ttl) {
        await this.redisClient.set(key, serialized, 'EX', ttl);
      } else {
        await this.redisClient.set(key, serialized);
      }
    } catch {
      //
    }
  };

  del = (key: string): Promise<number> => {
    return this.redisClient.del(key);
  };
}

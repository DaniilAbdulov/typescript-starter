import {Injectable} from '@nestjs/common';
import {User} from './types/users.dto';
import {RedisService} from './modules/redis/redis.service';

@Injectable()
export class AppService {
  constructor(private readonly redis: RedisService) {}

  getHello(): string {
    return 'Hello World!';
  }

  getById = async (id: number): Promise<User> => {
    const key = `user:${id}`;

    try {
      const userFromCache = await this.redis.get<User>(key); //тут очень хорош дженерик

      if (userFromCache) {
        console.log(`getById from cache...`);
        return userFromCache;
      }
    } catch (error) {
      console.log(error);
    }

    const user: User = {id: 1, name: 'name'};

    if (user?.id) {
      await this.redis.set(key, user);
    }

    return user;
  };
}

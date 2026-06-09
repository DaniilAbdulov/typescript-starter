import {Injectable} from '@nestjs/common';
import {User} from './types/users.dto';
import {RedisService} from './modules/redis/redis.service';
import {AppRepository} from './app.repository';

@Injectable()
export class AppService {
  constructor(
    private readonly redis: RedisService,
    private readonly repository: AppRepository,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  getById = async (id: number): Promise<User | null> => {
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

    const user = await this.repository.getById(id);

    if (user?.id) {
      await this.redis.set(key, user);
    }

    return user;
  };
}

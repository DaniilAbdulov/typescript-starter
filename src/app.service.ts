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

  getById = async (id: number): Promise<User | null> => {
    const key = `user:${id}`;

    const userFromCache = await this.redis.get<User>(key); //тут очень хорош дженерик

    if (userFromCache) {
      return userFromCache;
    }

    const user = await this.repository.getById(id);

    if (user?.id) {
      await this.redis.set(key, user);
    }

    return user;
  };

  createUser = (body: Omit<User, 'id'>) => {
    return this.repository.create(body);
  };
}

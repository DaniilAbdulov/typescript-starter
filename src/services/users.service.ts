import {Injectable} from '@nestjs/common';
import {User} from '../types/users.dto';
import {RedisService} from '../modules/redis/redis.service';
import {UsersRepository} from '../repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly redis: RedisService,
    private readonly repository: UsersRepository,
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

  create = (body: Omit<User, 'id'>) => this.repository.create(body);
}

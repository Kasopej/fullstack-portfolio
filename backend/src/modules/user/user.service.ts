import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { CRUDService } from 'src/types/services.types';
import { CreateUserDTO } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { HashingProvider } from 'src/providers/hashing.provider';

@Injectable()
export class UserService implements CRUDService {
  constructor(
    @InjectRepository(User)
    private readonly userRespository: Repository<User>,
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}
  async create(dto: CreateUserDTO): Promise<User> {
    const existingUser = await this.findByEmail(dto.email);
    if (existingUser) throw new BadRequestException('User already exists');
    const newUser = this.userRespository.create(dto);
    newUser.password =
      newUser.password &&
      (await this.hashingProvider.hashValue(newUser.password));
    await this.userRespository.save(newUser).catch(() => {
      throw new RequestTimeoutException();
    });
    return newUser;
  }
  update: (data: any, id: number) => Promise<unknown>;
  findById: (id: number) => Promise<unknown>;
  findAll: (query?: any) => Promise<unknown>;

  async findByEmail<
    O extends { strict?: boolean },
    R extends O extends { strict: false } ? User | null : User = O extends {
      strict: false;
    }
      ? User | null
      : User,
  >(email: string, { strict }: O = { strict: false } as O): Promise<R> {
    const user = await this.userRespository
      .findOneBy({
        email,
      })
      .catch(() => {
        throw new RequestTimeoutException('Request could not be completed', {
          description: 'database timeout',
        });
      });
    if (user || !strict) return user as R;
    throw new NotFoundException('user not found');
  }
}

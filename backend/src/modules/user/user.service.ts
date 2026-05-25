import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { CRUDService } from 'src/types/services.types';
import { CreateUserDTO, UpdateUserDTO } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { HashingProvider } from 'src/providers/hashing.provider';

@Injectable()
export class UserService implements CRUDService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    @Inject(HashingProvider)
    private readonly hashingProvider: HashingProvider,
  ) {}
  async create(dto: CreateUserDTO): Promise<User> {
    const existingUser = await this.findByEmail(dto.email);
    if (existingUser) throw new BadRequestException('User already exists');
    const newUser = this.repository.create(dto);
    newUser.password =
      newUser.password &&
      (await this.hashingProvider.hashValue(newUser.password));
    await this.repository.save(newUser).catch(() => {
      throw new RequestTimeoutException();
    });
    return newUser;
  }
  update: (id: number, data: UpdateUserDTO) => Promise<unknown>;
  async updatebyOauthId(OAuthId: string, dto: UpdateUserDTO): Promise<User> {
    const user = await this.repository
      .findOneOrFail({
        where: { OAuthId },
      })
      .catch(() => {
        const newUser = this.repository.create({ ...dto, OAuthId });
        return this.repository.save(newUser).catch((error) => {
          console.log(error);
          throw new NotFoundException('User not found');
        });
        // throw new NotFoundException('User not found');
      });
    return this.repository
      .save({
        ...user,
        ...dto,
      } as User)
      .catch(async () => {
        throw new InternalServerErrorException();
      });
  }

  async findByOAuthId(OAuthId: string): Promise<User> {
    try {
      return await this.repository.findOneOrFail({
        where: { OAuthId },
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }

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
    const user = await this.repository
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

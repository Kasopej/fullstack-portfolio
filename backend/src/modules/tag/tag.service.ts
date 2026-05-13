import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Tag } from './tag.entity';
import { CreateTagDTO } from './tag.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly repository: Repository<Tag>,
  ) {}

  public async create(dto: CreateTagDTO) {
    const skill = this.repository.create(dto);
    return this.repository.save(skill).catch(async () => {
      const existingSkill = await this.findByName(dto.name);
      throw new InternalServerErrorException(
        existingSkill ? 'Skill already exists' : undefined,
      );
    });
  }
  public async findById() {}
  public async findByName(name: string) {
    return this.repository.findOneBy({ name }).catch(() => {
      throw new InternalServerErrorException('Could not find skill');
    });
  }
  public async findAll() {}

  public async resolveTags(
    dtos: CreateTagDTO[],
    { insertedOnly }: { insertedOnly?: true } = {},
  ) {
    const names = dtos.map((s) => s.name);
    const existing = await this.repository.find({
      where: {
        name: In(names),
      },
    });

    const existingMap = new Map(existing.map((s) => [s.name, s]));
    const toInsert = dtos
      .filter((dto) => !existingMap.has(dto.name))
      .map((dto) => this.repository.create(dto));

    const inserted = await this.repository.save(toInsert).catch(() => {
      throw new InternalServerErrorException('Could not crete skills');
    });
    return !insertedOnly ? [...existing, ...inserted] : inserted;
  }
}

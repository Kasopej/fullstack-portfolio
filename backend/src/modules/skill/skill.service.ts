import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/types/services.types';
import { Skill } from './skill.entity';
import { ILike, In, Repository } from 'typeorm';
import { CreateSkillDTO, QuerySkillDTO } from './skill.dto';

@Injectable()
export class SkillService implements Omit<CRUDService, 'update'> {
  constructor(
    @InjectRepository(Skill)
    private readonly repository: Repository<Skill>,
  ) {}

  public async create(dto: CreateSkillDTO) {
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
  public async findAll(query?: QuerySkillDTO) {
    return this.repository
      .find({
        where: query
          ? {
              name: query.name ? ILike(`%${query.name}%`) : undefined,
            }
          : {},
      })
      .catch(() => {
        throw new InternalServerErrorException();
      });
  }

  public async resolveSkills(
    dtos: CreateSkillDTO[],
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

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CRUDService } from 'src/types/services.types';
import {
  CreateProjectDTO,
  QueryProjectDTO,
  UpdateProjectDTO,
} from './dto/project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { Repository } from 'typeorm';
import { PaginationService } from 'src/providers/pagination/pagination.service';
import type { PaginatedResponse } from 'src/providers/pagination/pagination.types';
import { SkillService } from '../skill/skill.service';
import { User } from '../user/user.entity';

@Injectable()
export class ProjectService implements CRUDService {
  constructor(
    @InjectRepository(Project)
    private readonly repository: Repository<Project>,
    private readonly paginationService: PaginationService,
    private readonly skillService: SkillService,
  ) {}

  public async create(dto: CreateProjectDTO, user?: User): Promise<Project> {
    if (!user) throw new UnauthorizedException();
    const resolvedSkills = await this.skillService.resolveSkills(dto.skills);
    const project = this.repository.create({
      ...dto,
      skills: resolvedSkills,
      author: user,
    });
    return this.repository.save(project).catch(async (error) => {
      console.error(error);
      throw new InternalServerErrorException();
    });
  }

  public async update(id: number, dto: UpdateProjectDTO) {
    const project = await this.repository
      .findOneOrFail({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException('Project not found');
      });
    const insertedSkills = await this.skillService.resolveSkills(
      dto.skills || [],
      { insertedOnly: true },
    );
    return this.repository
      .save({
        ...project,
        ...dto,
        skills: [...project.skills, ...insertedSkills],
      })
      .catch(async () => {
        new InternalServerErrorException();
      });
  }

  public async findById(id: number) {
    const project = await this.repository.findOneBy({ id }).catch(() => {
      throw new InternalServerErrorException('Could not find project');
    });
    if (project) return project;
    throw new NotFoundException('Could not find project');
  }

  public async findByTitle(title: string): Promise<Project | null> {
    const project = await this.repository.findOneBy({ title }).catch(() => {
      throw new InternalServerErrorException('Could not find project');
    });
    if (project) return project;
    throw new NotFoundException('Could not find project');
  }

  public async findAll(
    query?: QueryProjectDTO,
  ): Promise<PaginatedResponse<Project>> {
    return this.paginationService
      .paginateQuery(this.repository, query, {})
      .catch(() => {
        throw new InternalServerErrorException('No projects found');
      });
  }
}

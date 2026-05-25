import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { PaginationService } from 'src/providers/pagination/pagination.service';
import { SkillModule } from '../skill/skill.module';
import { AuthModule } from '../auth/auth.module';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    SkillModule,
    AuthModule,
    PermissionModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService, PaginationService],
})
export class ProjectModule {}

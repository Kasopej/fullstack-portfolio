import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Skill } from '../skill/skill.entity';
import { Exclude } from 'class-transformer';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 48,
    type: 'varchar',
    nullable: false,
    name: 'title',
  })
  title: string;

  @Column({
    length: 96,
    type: 'varchar',
    nullable: false,
    name: 'description',
  })
  description: string;

  @Column({
    type: 'text',
    nullable: false,
    name: 'html',
  })
  html: string;

  @Column({
    length: 256,
    type: 'varchar',
    nullable: false,
    name: 'cover_image',
  })
  coverImage: string;

  @ManyToOne(() => User, { cascade: false, eager: false })
  @JoinColumn({ name: 'author_id' })
  author: User;
  @Exclude()
  @ManyToMany(() => Skill, (skill) => skill.projects, {
    eager: true,
  })
  @JoinTable({
    name: 'projects_skills',
    joinColumn: {
      name: 'projectId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'skillId',
      referencedColumnName: 'id',
    },
  })
  skills: Skill[];

  @Column({
    length: 96,
    type: 'varchar',
    nullable: true,
    name: 'repo_link',
  })
  repoUrl?: string;

  @Column({
    length: 96,
    type: 'varchar',
    nullable: true,
    name: 'project_url',
  })
  projectUrl?: string;
}

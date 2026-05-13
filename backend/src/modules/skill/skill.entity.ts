import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from '../project/project.entity';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 48,
    type: 'varchar',
    nullable: false,
    unique: true,
    name: 'name',
  })
  name: string;

  @ManyToMany(() => Project, { cascade: false })
  projects: Project[];
}

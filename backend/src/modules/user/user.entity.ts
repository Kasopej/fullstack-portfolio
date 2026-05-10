import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from '../project/project.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 256,
    type: 'varchar',
    nullable: false,
    name: 'first_name',
  })
  firstName: string;

  @Column({
    length: 256,
    type: 'varchar',
    nullable: false,
    name: 'last_name',
  })
  lastName: string;

  @Column({
    length: 96,
    type: 'varchar',
    nullable: false,
    name: 'email',
    unique: true,
  })
  email: string;

  @Column({
    length: 96,
    type: 'varchar',
    nullable: true,
    name: 'password',
  })
  @Exclude()
  password?: string;

  @OneToMany(() => Project, (project) => project.author)
  projects: Project[];
}

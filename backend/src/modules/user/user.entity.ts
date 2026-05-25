import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from '../project/project.entity';
import { Role } from '../permission/permission.entity';

@Entity('users')
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

  @Column({
    length: 96,
    type: 'varchar',
    nullable: false,
    name: 'oauth_id',
    unique: true,
  })
  OAuthId?: string;

  @ManyToOne(() => Role, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({
    name: 'roleId',
  })
  role: Role;

  @OneToMany(() => Project, (project) => project.author)
  projects: Project[];
}

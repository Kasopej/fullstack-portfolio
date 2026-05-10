import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ name: 'project' })
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({
    length: 96,
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
}

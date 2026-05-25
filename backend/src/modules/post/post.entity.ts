import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Exclude, Transform } from 'class-transformer';
import { Tag } from '../tag/tag.entity';
import { PublishStatus } from 'src/types';

@Entity('posts')
export class Post {
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

  @ManyToMany(() => Tag, (tag) => tag.posts, {
    eager: true,
  })
  @JoinTable({
    name: 'posts_skills',
    joinColumn: {
      name: 'postId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tagId',
      referencedColumnName: 'id',
    },
  })
  tags: Tag[];

  @Transform(({ value }) => (value as bigint).toString())
  @Column({
    type: 'bigint',
    nullable: true,
  })
  estimatedReadingTime?: bigint;

  @Column({
    name: 'publish',
    type: 'enum',
    enum: PublishStatus,
    nullable: true,
  })
  publish?: PublishStatus;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt?: Date;
}

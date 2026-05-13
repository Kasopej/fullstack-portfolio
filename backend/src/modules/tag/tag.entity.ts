import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../post/post.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 96,
    type: 'varchar',
    nullable: false,
    name: 'name',
  })
  name: string;

  @ManyToMany(() => Post, { cascade: false })
  posts: Post[];
}

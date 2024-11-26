import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
  } from 'typeorm';
  import { User } from 'src/users/entities/user.entity';
  import { Comment } from 'src/comments/entities/comment.entity';
  import { Like } from 'src/likes/entities/like.entity';
  
  @Entity()
  export class Article {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    title: string;
  
    @Column()
    body: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @ManyToOne(() => User, (user) => user.articles, { onDelete: 'CASCADE' })
    author: User;
  
    @OneToMany(() => Comment, (comment) => comment.article)
    comments: Comment[];
  
    @OneToMany(() => Like, (like) => like.article)
    likes: Like[];
  }
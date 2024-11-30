import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    Index,
} from 'typeorm';
import { Article } from '../../articles/entities/article.entity'; // relative path
import { Comment } from 'src/comments/entities/comment.entity';
  import { Like } from 'src/likes/entities/like.entity';
  
  @Index(['username'])
  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    username: string;
  
    @Column()
    password: string;
  
    @Column({ nullable: true })
    email: string;
  
    @Column({ default: new Date() })
    createdAt: Date;
  
    @OneToMany(() => Article, (article) => article.author)
    articles: Article[];
  
    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];
  
    @OneToMany(() => Like, (like) => like.user)
    likes: Like[];
  }
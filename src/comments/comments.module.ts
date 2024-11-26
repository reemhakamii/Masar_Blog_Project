import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './comments.service';
import { CommentController } from './comments.controller';
import { Comment } from './entities/comment.entity';
import { ArticleModule } from 'src/articles/articles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    ArticleModule, // Correct module name
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentsModule {}
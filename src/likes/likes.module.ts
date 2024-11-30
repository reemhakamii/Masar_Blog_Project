import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeService } from './likes.service';
import { LikeController } from './likes.controller';
import { Like } from './entities/like.entity';
import { ArticleModule } from '../articles/articles.module'; 
import { UserModule } from '../users/users.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Like]),
    ArticleModule, 
    UserModule, 
  ],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikesModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeService } from './likes.service';
import { LikeController } from './likes.controller';
import { Like } from './entities/like.entity';
import { ArticleModule } from '../articles/articles.module'; // If you need ArticleService
import { UserModule } from '../users/users.module'; // If you need UserService

@Module({
  imports: [
    TypeOrmModule.forFeature([Like]), // Register Like entity
    ArticleModule, // Import ArticleModule if ArticleService is required
    UserModule, // Import UserModule if UserService is required
  ],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikesModule {}
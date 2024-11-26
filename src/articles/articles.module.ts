import { Module } from '@nestjs/common';
import { ArticleService } from './articles.service';
import { ArticleController } from './articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Article])],
  providers: [ArticleService, JwtAuthGuard],
  controllers: [ArticleController],
  exports: [ArticleService], // Export the service
})
export class ArticleModule {}
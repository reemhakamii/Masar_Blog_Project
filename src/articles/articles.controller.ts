import { Controller, Post, Get, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ArticleService } from './articles.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createArticle(
    @Body('title') title: string,
    @Body('body') body: string,
    @CurrentUser() user: User,
  ) {
    const article = await this.articleService.createArticle(title, body, user);
    return { message: 'Article created successfully', article };
  }

  @Get()
  async getArticles(@Query('page') page: number = 1, @Query('pageSize') pageSize: number = 10) {
    const [articles, total] = await this.articleService.getArticles(page, pageSize);
    return { total, page, pageSize, articles };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteArticle(@Param('id') id: number, @CurrentUser() user: User) {
    await this.articleService.deleteArticle(id, user.id);
    return { message: 'Article deleted successfully' };
  }
}
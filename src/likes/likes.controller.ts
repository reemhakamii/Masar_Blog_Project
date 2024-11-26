import { Controller, Post, Delete, Param, UseGuards, Req, Get, Query } from '@nestjs/common';
import { LikeService } from './likes.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('articles/:articleId/likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('articleId') articleId: number,
    @Req() req: any,
  ) {
    return this.likeService.create(articleId, req.user.id);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('articleId') articleId: number,
    @Req() req: any,
  ) {
    return this.likeService.remove(articleId, req.user.id);
  }

  @Get()
  async findAll(
    @Param('articleId') articleId: number,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return this.likeService.findAll(articleId, page, pageSize);
  }

  
}
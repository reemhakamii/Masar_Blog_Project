import { Controller, Post, Body, Param, Get, NotFoundException, Query } from '@nestjs/common';
import { CommentService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { CurrentUser } from 'src/auth/current-user.decorator'; // Decorator for current user
import { User } from 'src/users/entities/user.entity';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('article/:articleId')
  async createComment(
    @Param('articleId') articleId: number,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: User, // Get current user from the request
  ): Promise<Comment> {
    createCommentDto.user = user; // Attach the user to the DTO
    return this.commentService.create({ ...createCommentDto, articleId });
  }

  @Get(':id')
  async getComment(@Param('id') id: number): Promise<Comment> {
    const comment = await this.commentService.findOne(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  @Get('article/:articleId')
  async getCommentsByArticle(
    @Param('articleId') articleId: number,
    @Query('page') page: number = 1, // Default to page 1
    @Query('limit') limit: number = 10, // Default to 10 comments per page
    @Query('search') search: string = '', // Optional search query
  ): Promise<Comment[]> {
    return this.commentService.findAllByArticle(articleId, page, limit, search);
  }
}
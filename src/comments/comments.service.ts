import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ArticleService } from 'src/articles/articles.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly articleService: ArticleService, // Inject ArticleService to verify article existence
  ) {}

  // Create a comment
  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { text, articleId, user } = createCommentDto;

    // Check if the article exists before creating the comment
    const article = await this.articleService.findOne(articleId);
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    const comment = this.commentRepository.create({
      text,
      article,
      user,
    });

    return this.commentRepository.save(comment);
  }

  // Find a comment by its ID
  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'article'], // Return the associated user and article
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  // Get comments by articleId with pagination and search
  async findAllByArticle(
    articleId: number,
    page: number = 1,
    limit: number = 10,
    search: string = '',
  ): Promise<Comment[]> {
    const queryBuilder = this.commentRepository.createQueryBuilder('comment');

    // Search by text
    if (search) {
      queryBuilder.andWhere('comment.text LIKE :search', { search: `%${search}%` });
    }

    // Join with user and article
    queryBuilder
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.article', 'article')
      .where('article.id = :articleId', { articleId });

    // Pagination
    queryBuilder.skip((page - 1) * limit).take(limit);

    return await queryBuilder.getMany();
  }
}
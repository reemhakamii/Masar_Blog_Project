import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ArticleService } from "src/articles/articles.service";
import { UserService } from "src/users/users.service";
import { Repository } from "typeorm";
import { Like } from "./entities/like.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    private articleService: ArticleService,
    private userService: UserService,
  ) {}

  async create(articleId: number, userId: number): Promise<Like> {
    const article = await this.articleService.findOne(articleId);
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingLike = await this.likeRepository.findOneBy({
      article: { id: articleId },
      user: { id: userId }, 
    });

    if (existingLike) {
      throw new ConflictException('You have already liked this article');
    }

    const like = this.likeRepository.create({
      article,
      user, 
    });

    return this.likeRepository.save(like);
  }

  async remove(articleId: number, userId: number): Promise<void> {
    const like = await this.likeRepository.findOneBy({
      article: { id: articleId },
      user: { id: userId },
    });

    if (!like) {
      throw new NotFoundException('Like not found');
    }

    await this.likeRepository.remove(like);
  }

  async findAll(articleId: number, page: number = 1, pageSize: number = 10): Promise<Like[]> {
    return this.likeRepository.find({
      where: { article: { id: articleId } },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }
}
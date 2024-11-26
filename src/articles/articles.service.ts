import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async createArticle(title: string, body: string, author: User): Promise<Article> {
    const article = this.articleRepository.create({ title, body, author });
    return this.articleRepository.save(article);
  }

  async getArticles(page: number, pageSize: number): Promise<[Article[], number]> {
    return this.articleRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: ['author'],
    });
  }

  async deleteArticle(articleId: number, userId: number): Promise<void> {
    const article = await this.articleRepository.findOne({ where: { id: articleId, author: { id: userId } } });
    if (!article) {
      throw new Error('Article not found or unauthorized');
    }
    await this.articleRepository.delete(articleId);
  }
  async findOne(id: number): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { id },
    });

    if (!article) {
      throw new Error('Article not found');
    }

    return article;
  }
}
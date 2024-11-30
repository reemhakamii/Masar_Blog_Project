import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './app.module'; 
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import { User } from 'src/users/entities/user.entity';

const mockAuthService = {
  register: jest.fn().mockResolvedValue({
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword',
  }),
  login: jest.fn().mockResolvedValue({
    access_token: 'fake-jwt-token',
  }),
};

describe('AppController (e2e)', () => {
  let app;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], 
    })
      .overrideProvider(AuthService) 
      .useValue(mockAuthService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should create a new user and return user data', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: 'testuser', email: 'test@example.com', password: 'password' });

    expect(response.status).toBe(201); 
    expect(response.body.username).toBe('testuser');
    expect(response.body.email).toBe('test@example.com');
  });

  it('should login and return a JWT token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'testuser', password: 'password' });

    expect(response.status).toBe(200);
    expect(response.body.access_token).toBeDefined();
  });

  it('should create an article and return article data', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'testuser', password: 'password' });

    const token = loginResponse.body.access_token;

    const response = await request(app.getHttpServer())
      .post('/articles')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Article', body: 'This is a test article.' });

    expect(response.status).toBe(201); 
    expect(response.body.article.title).toBe('Test Article');
  });

  it('should return list of articles', async () => {
    const response = await request(app.getHttpServer())
      .get('/articles')
      .query({ page: 1, pageSize: 10 });

    expect(response.status).toBe(200);
    expect(response.body.articles.length).toBeGreaterThan(0);
  });

  it('should delete an article', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'testuser', password: 'password' });

    const token = loginResponse.body.access_token;

    const createResponse = await request(app.getHttpServer())
      .post('/articles')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Article', body: 'This is a test article.' });

    const articleId = createResponse.body.article.id;

    const deleteResponse = await request(app.getHttpServer())
      .delete(`/articles/${articleId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe('Article deleted successfully');
  });

  afterAll(async () => {
    await app.close();
  });
});
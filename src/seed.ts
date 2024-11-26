import { getRepository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { User } from './users/entities/user.entity';
import { Article } from './articles/entities/article.entity';

async function seedDatabase() {
    const userRepository = getRepository(User);
    const articleRepository = getRepository(Article);

    const users = [];
    const articles = [];

    for (let i = 0; i < 1_000_000; i++) {
        const user = userRepository.create({
            username: faker.internet.userName(),
            password: faker.internet.password(), // Hash during actual save
            email: faker.internet.email(),
            createdAt: faker.date.past(),
        });
        users.push(user);

        await userRepository.save(users);
        await articleRepository.save(articles);
    }

    seedDatabase().then(() => console.log('Database Seeded!'));
}
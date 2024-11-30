import { Injectable } from '@nestjs/common';
import { UserService } from './users/users.service';
import { User } from './users/entities/user.entity';
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';

@Injectable()
export class AppService {
  constructor(
    private usersService: UserService,
    private readonly dataSource: DataSource,
  ) {}

  async generateFakeUsers(count: number): Promise<User[]> {
    const userRepository = this.dataSource.getRepository(User);
    const users = [];
  
    console.log(`Generating ${count} fake users...`);
  
    if (isNaN(count) || count <= 0 || count > 1000000) {
      console.log('Invalid count value');
      throw new Error('Please provide a valid count greater than 0 and up to 1,000,000.');
    }
  
    for (let i = 0; i < count; i++) {
      const user = new User();
      user.email = faker.internet.email();
      user.username = faker.internet.userName();
      user.password = faker.internet.password();
      users.push(user);
  
      if (users.length === 1000 || i === count - 1) {
        console.log(`Saving batch of ${users.length} users...`);
        try {
          await userRepository.save(users);
          users.length = 0; 
        } catch (error) {
          console.error('Error during batch save:', error);
          throw new Error('Error saving users to database');
        }
      }
    }
  
    return [];
  }
}
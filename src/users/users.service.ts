import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDtos: CreateUserDto[] | CreateUserDto): Promise<User[] | User> {
    if (Array.isArray(createUserDtos)) {
      const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
  
      const users = createUserDtos.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, saltRounds),
      }));
  
      return this.userRepository.save(users); // Bulk insert
    } else {
      const { username, password, email } = createUserDtos;
      const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = this.userRepository.create({ username, password: hashedPassword, email });
      return this.userRepository.save(user);
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } }); // Adjust this based on your ORM
  }

  async findById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    console.log('Password:', password);
    console.log('Hashed Password:', hashedPassword);
    return bcrypt.compare(password, hashedPassword);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10); // Hash new password
    }

    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOne({ where: { id } });
  }
}
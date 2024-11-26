import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/users.service';
import { JwtPayload } from './jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  // Login method to generate JWT token
  async login(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await this.validatePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const payload: JwtPayload = { sub: user.id, username: user.username };
    const accessToken = this.jwtService.sign(payload);

    return { access_token: accessToken };
  }

  // Register method to create a new user
  async register(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto; // Extract user data (username, email)
    const hashedPassword = await this.hashPassword(password); // Hash the password

    const user = await this.userService.createUser({ ...userData, password: hashedPassword }); // Pass the hashed password
    return { message: 'User registered successfully', user };
  }

  // Hash password before storing it in DB
  async hashPassword(password: string): Promise<string> {
    const BCRYPT_SALT_ROUNDS = this.configService.get<number>('BCRYPT_SALT_ROUNDS', 10);
    return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  }

  // Validate password during login
  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Generate JWT token for the user
  generateJWT(user: User): string {
    const payload: JwtPayload = { sub: user.id, username: user.username };
    return this.jwtService.sign(payload, { expiresIn: '1h' }); 
  }

  // Verify the JWT token
  verifyJWT(token: string): any {
    return this.jwtService.verify(token);
  }
}
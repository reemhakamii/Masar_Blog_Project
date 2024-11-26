import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtPayload } from './jwt-payload.interface';
import { User } from 'src/users/entities/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  // Register method to create a new user
  async register(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;
    const hashedPassword = await this.hashPassword(password); // Hash the password
    const user = await this.userService.createUser({
      ...userData,
      password: hashedPassword,
    });
    return { message: 'User registered successfully', user };
  }

  // Login method to generate JWT token
  async login(username: string, password: string) {
    console.log("Attempting login with:", username, password);
    try {
      const user = await this.userService.findByUsername(username);
      console.log("User fetched from DB:", user);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log("Password valid:", isPasswordValid);
  
      if (!isPasswordValid) {
        throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
      }
  
      const payload: JwtPayload = { sub: user.id, username: user.username };
      const accessToken = this.jwtService.sign(payload);
      console.log("JWT token generated:", accessToken);
  
      return { access_token: accessToken };
    } catch (error) {
      console.error("Login error:", error.message);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Hash password before storing it in DB
  async hashPassword(password: string): Promise<string> {
    const saltRounds = Number(this.configService.get<number>('BCRYPT_SALT_ROUNDS', 10));
    return bcrypt.hash(password, saltRounds);
  }

  // Validate password during login
  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    console.log("Validating password...");
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
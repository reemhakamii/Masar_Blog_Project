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

    async register(createUserDto: CreateUserDto) {
        const saltRounds = this.configService.get<number>('BCRYPT_SALT_ROUNDS', 10);
        console.log('Salt Rounds:', saltRounds);
      const { password, ...userData } = createUserDto;
      const hashedPassword = await this.hashPassword(password); // Hash the password
      console.log('Hashed Password:', hashedPassword); // Log for debugging
    const user = await this.userService.createUser({
      ...userData,
      password: hashedPassword,
    });
    return { message: 'User registered successfully', user };
  }

  async login(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
  
    if (!user) {
      console.log('User not found:', username);
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const rehashedPassword = await bcrypt.hash(password, 10);
    console.log('Input Password:', password);
    console.log('Rehashed Input Password:', rehashedPassword);
    console.log('Stored Hashed Password:', user.password);
    console.log('Password Match:', await bcrypt.compare(password, user.password));

  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password Validation Result:', isPasswordValid);
  
    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }
  
    const payload = { sub: user.id, username: user.username };
    const accessToken = this.jwtService.sign(payload);
  
    console.log('Login Successful. JWT:', accessToken);
  
    return { 
      message: 'Login successful', 
      access_token: accessToken 
    };
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = Number(this.configService.get<number>('BCRYPT_SALT_ROUNDS', 10));
    return bcrypt.hash(password, saltRounds);
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    console.log("Validating password...");
    return bcrypt.compare(password, hashedPassword);
  }

  generateJWT(user: User): string {
    const payload: JwtPayload = { sub: user.id, username: user.username };
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  verifyJWT(token: string): any {
    return this.jwtService.verify(token);
  }
}
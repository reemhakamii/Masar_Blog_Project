import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { UserService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('email') email: string,
  ) {
    const user = await this.userService.createUser({
      username,
      password,
      email,
    });
    return { message: 'User registered successfully', user };
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      console.log('User not found');
      throw new Error('Invalid credentials');
    }
  
    const isPasswordValid = await this.userService.validatePassword(password, user.password);
    console.log('Is password valid:', isPasswordValid);
  
    if (!isPasswordValid) {
      console.log('Invalid password');
      throw new Error('Invalid credentials');
    }
  
    const token = this.authService.generateJWT(user);
    return { message: 'Login successful', token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Body('id') id: number) {
    return this.userService.findById(id);
  }
}
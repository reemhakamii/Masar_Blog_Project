import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Registration endpoint
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);  // Calls authService.register to create a new user
  }

  // Login endpoint
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;
    return await this.authService.login(username, password); // Calls authService.login with username and password
  }

  // Protected route: Fetch current user profile
  @UseGuards(JwtAuthGuard) // Protect this route using JWT authentication
  @Post('profile')
  getProfile(@CurrentUser() user: User) {
    return {
      message: 'Profile fetched successfully',
      user,
    };
  }
}
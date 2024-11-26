import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { UserService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto'; // Create a DTO for user registration
import { LoginUserDto } from './dto/login-user.dto'; // DTO for login
import { UpdateUserDto } from './dto/update-user.dto'; // Optional, for updating user info

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // Register user
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return { message: 'User registered successfully', user };
  }

  // User login and JWT generation
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.userService.findByUsername(loginUserDto.username);
    if (!user || !(await this.userService.validatePassword(loginUserDto.password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const token = this.authService.generateJWT(user);
    return { message: 'Login successful', token };
  }

  // Get profile info of authenticated user
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    const userId = req.user.id; // Get userId from the request (JWT token)
    return this.userService.findById(userId);
  }

  // Optionally, an endpoint to update user info
  @UseGuards(JwtAuthGuard)
  @Post('update')
  async updateUser(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.id;
    return this.userService.updateUser(userId, updateUserDto);
  }
}
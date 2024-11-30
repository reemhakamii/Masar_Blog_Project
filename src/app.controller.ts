import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('generate-users')
  async generateUsers(@Query('count') count: string) {
    const parsedCount = parseInt(count, 10);

    if (isNaN(parsedCount) || parsedCount <= 0 || parsedCount > 1000000) {
      return {
        message: 'Please provide a valid count greater than 0 and up to 1,000,000.',
      };
    }

    const result = await this.appService.generateFakeUsers(parsedCount);
    return {
      message: `${parsedCount} fake users generated successfully!`,
      users: result,
    };
  }
}
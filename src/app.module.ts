import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { ArticleModule } from './articles/articles.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),  // Ensure this is loaded first
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Ensure ConfigModule is imported first
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres', // Hardcoded for postgres, make sure to adjust this based on your DB
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT') || 8000, // Ensure the port is a number
        username: configService.get('DB_USERNAME'),
        password: '',
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true
      }),
      inject: [ConfigService],  // Inject ConfigService into the factory
      inject: [ConfigService],  // Inject ConfigService into the factory//
    }),
    AuthModule, 
    UserModule,
    ArticleModule, 
    CommentsModule,
    LikesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
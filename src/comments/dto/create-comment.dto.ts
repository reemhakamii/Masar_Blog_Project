import { IsString, IsNotEmpty } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  user: User;

  articleId: number; 
}
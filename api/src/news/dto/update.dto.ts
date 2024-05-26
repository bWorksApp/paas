// todo/dto/update-todo.dto.ts
import { BaseNewsDto } from './base.dto';

export class UpdateNewsDto extends BaseNewsDto {
  completedAt: Date;
}

// todo/dto/update-todo.dto.ts
import { BaseAccessTokenDto } from './base.dto';

export class UpdateAccessTokenDto extends BaseAccessTokenDto {
  completedAt: Date;
}

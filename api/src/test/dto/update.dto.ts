// todo/dto/update-todo.dto.ts
import { BaseTestDto } from './base.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateTestDto extends PartialType(BaseTestDto) {
  completedAt: Date;
}

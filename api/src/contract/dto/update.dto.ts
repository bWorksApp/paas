// todo/dto/update-todo.dto.ts
import { BaseContractDto } from './base.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateContractDto extends PartialType(BaseContractDto) {
  completedAt: Date;
}

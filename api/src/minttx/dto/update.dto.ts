// todo/dto/update-todo.dto.ts
import { BaseMintDto } from './base.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateMintDto extends PartialType(BaseMintDto) {
  completedAt: Date;
}

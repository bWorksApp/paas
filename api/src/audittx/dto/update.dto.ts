// todo/dto/update-todo.dto.ts
import { BaseAuditTxDto } from './base.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateAuditTxDto extends PartialType(BaseAuditTxDto) {
  completedAt: Date;
}

import { Module } from '@nestjs/common';
import { AuditTxService } from './service';
import { AuditTxController } from './controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditTx, AuditTxSchema } from './schemas/schema';

@Module({
  providers: [AuditTxService],
  controllers: [AuditTxController],
  exports: [AuditTxService],
  imports: [
    MongooseModule.forFeature([{ name: AuditTx.name, schema: AuditTxSchema }]),
  ],
})
export class AuditTxModule {}

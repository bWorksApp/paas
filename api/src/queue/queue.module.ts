import { BullModule } from '@nestjs/bull';
import { Module, forwardRef } from '@nestjs/common';
import { QueueController } from './queue.controller';
import { QueueProcessor } from './queue.processor';
import { ContractModule } from '../contract/module';
import { PlutusTxModule } from '../plutustx/module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'queue',
      limiter: {
        max: 10,
        duration: 1000,
      },
    }),
    forwardRef(() => ContractModule),
    PlutusTxModule,
  ],
  controllers: [QueueController],
  providers: [QueueProcessor],
  exports: [BullModule],
})
export class QueueModule {}

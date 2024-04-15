import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QueueController } from './queue.controller';
import { QueueProcessor } from './queue.processor';
import { WalletModule } from '../wallet/module';
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
    WalletModule,
    PlutusTxModule,
  ],
  controllers: [QueueController],
  providers: [QueueProcessor],
  exports: [BullModule],
})
export class QueueModule {}

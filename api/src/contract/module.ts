import { Module, forwardRef } from '@nestjs/common';
import { ContractService } from './service';
import { ContractController } from './controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Contract, ContractSchema } from './schemas/schema';
import { QueueModule } from '../queue/queue.module';

@Module({
  providers: [ContractService],
  controllers: [ContractController],
  imports: [
    MongooseModule.forFeature([
      { name: Contract.name, schema: ContractSchema },
    ]),
    forwardRef(() => QueueModule),
  ],
  exports: [ContractService],
})
export class ContractModule {}

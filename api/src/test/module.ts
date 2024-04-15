import { Module } from '@nestjs/common';
import { TestService } from './service';
import { TestController } from './controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestSchema } from './schemas/schema';
import { QueueModule } from '../queue/queue.module';

@Module({
  providers: [TestService],
  controllers: [TestController],
  exports: [TestService],
  imports: [
    MongooseModule.forFeature([{ name: Test.name, schema: TestSchema }]),
    QueueModule,
  ],
})
export class TestModule {}

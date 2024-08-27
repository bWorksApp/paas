import { Module } from '@nestjs/common';
import { MintService } from './service';
import { MintController } from './controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Mint, MintSchema } from './schemas/schema';

@Module({
  providers: [MintService],
  controllers: [MintController],
  exports: [MintService],
  imports: [
    MongooseModule.forFeature([
      { name: Mint.name, schema: MintSchema },
    ]),
  ],
})
export class MintModule {}

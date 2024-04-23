import { Module } from '@nestjs/common';
import { PublicService } from './public.service';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { PublicController } from './public.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PlutusTxModule } from '../plutustx/module';
import {
  TokenReceiver,
  TokenReceiverSchema,
} from './schemas/token-receiver.schema';
import { Campaign, CampaignSchema } from './schemas/campaign.schema';
import { UserModule } from '../user/user.module';
import { CustomController } from './custom.controller';
import { ContractModule } from '../contract/module';

//apis for homepage & other public requests
@Module({
  providers: [PublicService, SearchService],
  controllers: [PublicController, SearchController, CustomController],
  imports: [
    MongooseModule.forFeature([
      { name: TokenReceiver.name, schema: TokenReceiverSchema },
      { name: Campaign.name, schema: CampaignSchema },
    ]),
    PlutusTxModule,
    UserModule,
    ContractModule,
  ],
  exports: [PublicService, SearchService],
})
export class PublicModule {}

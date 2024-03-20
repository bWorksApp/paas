import { Module } from '@nestjs/common';
import { AccessTokenService } from './service';
import { AccessTokenController } from './controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessToken, AccessTokenSchema } from './schemas/schema';

@Module({
  providers: [AccessTokenService],
  controllers: [AccessTokenController],
  exports: [AccessTokenService],
  imports: [
    MongooseModule.forFeature([
      { name: AccessToken.name, schema: AccessTokenSchema },
    ]),
  ],
})
export class AccessTokenModule {}

import { TestModule } from './test/module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CurrencyModule } from './currency/module';
import { ToolModule } from './tool/module';
import { WalletModule } from './wallet/module';
import { ContractModule } from './contract/module';
import { PlutusTxModule } from './plutustx/module';
import { QueueModule } from './queue/queue.module';
import { AdminWalletModule } from './adminwallet/module';
import { PublicModule } from './customapi/module';
import { MailModule } from './mail/mail.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AccessTokenModule } from './accesstoken/module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './flatworks/roles/roles.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: 6379,
      },
    }),
    MongooseModule.forRoot(process.env.CONNECTION_STRING),
    UserModule,
    AuthModule,
    CurrencyModule,
    ToolModule,
    WalletModule,
    QueueModule,
    ContractModule,
    PlutusTxModule,
    AdminWalletModule,
    PublicModule,
    MailModule,
    AccessTokenModule,
    TestModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}

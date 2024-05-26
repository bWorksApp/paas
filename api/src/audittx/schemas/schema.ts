import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';
import { Schema as MongooseSchema } from 'mongoose';

export type AuditTxDocument = AuditTx & Document;

@Schema()
export class AuditTx {
  @Prop({ required: true })
  name: string;

  @Prop()
  smartContractId: string;

  @Prop()
  lockUserId: string;

  @Prop()
  unlockUserId: string;

  @Prop({ required: true })
  assetName: string;

  @Prop({ required: true })
  amount: number;

  @Prop()
  lockedTxHash: string;

  @Prop()
  isLockSuccess: boolean;

  @Prop()
  isUnlockSuccess: boolean;

  @Prop()
  unlockType: string;

  @Prop()
  unlockedTxHash: string;

  @Prop()
  lockDate: Date;

  @Prop()
  unlockDate: Date;

  @Prop({ type: MongooseSchema.Types.Mixed })
  datum: any;

  @Prop({ type: MongooseSchema.Types.Mixed })
  redeemer: any;

  @Prop()
  contractAddress: string;

  @Prop()
  description: string;

  @Prop()
  completedAt?: Date;

  @Prop()
  createdAt?: Date;
}

const AuditTxSchema = SchemaFactory.createForClass(AuditTx);
AuditTxSchema.plugin(uniqueValidator);

AuditTxSchema.index(
  {
    name: 'text',
    lockedTxHash: 'text',
    contractAddress: 'text',
    unlockedTxHash: 'text',
  },
  {
    weights: {
      name: 1,
      lockedTxHash: 1,
      contractAddress: 1,
      unlockedTxHash: 1,
    },
    name: 'textIndex',
  },
);

export { AuditTxSchema };

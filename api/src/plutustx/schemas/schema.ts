import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';
import { Schema as MongooseSchema } from 'mongoose';
export type PlutusTxDocument = PlutusTx & Document;

@Schema()
export class PlutusTx {
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
  isUnlocked: boolean;

  @Prop()
  unlockType: string;

  @Prop()
  unlockedTxHash: string;

  @Prop()
  unlockMessage: string;

  @Prop()
  lockMessage: string;

  @Prop()
  lockDate: Date;

  @Prop()
  unlockDate: Date;

  @Prop()
  datumUnlockPublicKeyHash: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  datum: any;

  @Prop({ type: MongooseSchema.Types.Mixed })
  redeemer: any;

  @Prop()
  scriptAddress: string;

  @Prop()
  description: string;

  @Prop()
  completedAt?: Date;

  @Prop()
  createdAt?: Date;
}

const PlutusTxSchema = SchemaFactory.createForClass(PlutusTx);
PlutusTxSchema.plugin(uniqueValidator);

PlutusTxSchema.index(
  {
    name: 'text',
    lockedTxHash: 'text',
    scriptAddress: 'text',
    unlockedTxHash: 'text',
  },
  {
    weights: {
      name: 1,
      lockedTxHash: 1,
      scriptAddress: 1,
      unlockedTxHash: 1,
    },
    name: 'textIndex',
  },
);

export { PlutusTxSchema };

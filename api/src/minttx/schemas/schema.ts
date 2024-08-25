import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';
import { Schema as MongooseSchema } from 'mongoose';
import { AssetMetadata, Asset } from '../../flatworks/types/types';
export type MintDocument = Mint & Document;

@Schema()
export class Mint {
  @Prop()
  smartContractId: string;

  @Prop()
  mintedByUserId: string;

  @Prop()
  mintTxHash: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  redeemer: any;

  @Prop()
  mintDate: Date;

  @Prop({ type: MongooseSchema.Types.Mixed })
  assetMetadata: AssetMetadata;

  @Prop({ type: MongooseSchema.Types.Mixed })
  asset: Asset;

  @Prop()
  description: string;

  @Prop()
  completedAt?: Date;

  @Prop()
  createdAt?: Date;
}

const MintSchema = SchemaFactory.createForClass(Mint);
MintSchema.plugin(uniqueValidator);

MintSchema.index(
  {
    mintTxHash: 'text',
  },
  {
    weights: {
      mintTxHash: 1,
    },
    name: 'textIndex',
  },
);

export { MintSchema };

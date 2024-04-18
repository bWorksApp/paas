import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';
import {
  MarloweSmartContract,
  PlutusSmartContract,
  AikenSmartContract,
  ContractType,
  ContractRepo,
} from '../../flatworks/types/types';
import { Schema as MongooseSchema } from 'mongoose';
export type ContractDocument = Contract & Document;

@Schema()
export class Contract {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  version: string;

  @Prop()
  author: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  contract: MarloweSmartContract | PlutusSmartContract | AikenSmartContract;

  @Prop({ type: MongooseSchema.Types.Mixed })
  compiledContract:
    | MarloweSmartContract
    | PlutusSmartContract
    | AikenSmartContract;

  @Prop()
  contractType: ContractType;

  @Prop({ type: MongooseSchema.Types.Mixed })
  gitRepo: ContractRepo;

  @Prop({ default: false })
  isSourceCodeVerified: boolean;

  @Prop({ default: false })
  isFunctionVerified: boolean;

  @Prop({ default: false })
  isApproved: boolean;

  @Prop()
  description: string;

  @Prop()
  completedAt?: Date;

  @Prop()
  createdAt?: Date;
}

const ContractSchema = SchemaFactory.createForClass(Contract);
ContractSchema.plugin(uniqueValidator);

export { ContractSchema };

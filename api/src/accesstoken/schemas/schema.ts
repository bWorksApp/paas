import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';
import { DApp } from '../../flatworks/types/types';

export type AccessTokenDocument = AccessToken & Document;

@Schema()
export class AccessToken {
  @Prop()
  token: string;

  @Prop({ required: true })
  userId: string;

  @Prop()
  dApps: DApp[];

  @Prop()
  description: string;

  @Prop()
  expire: Date;

  @Prop()
  completedAt?: Date;

  @Prop()
  createdAt?: Date;
}

const AccessTokenSchema = SchemaFactory.createForClass(AccessToken);
AccessTokenSchema.plugin(uniqueValidator);

export { AccessTokenSchema };

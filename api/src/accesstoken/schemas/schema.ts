import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

export type AccessTokenDocument = AccessToken & Document;

@Schema()
export class AccessToken {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  token: string;

  @Prop()
  expire: Date;

  @Prop()
  completedAt?: Date;

  @Prop()
  createdAt?: Date;
}

const AccessTokenSchema = SchemaFactory.createForClass(AccessToken);
AccessTokenSchema.plugin(uniqueValidator);
AccessTokenSchema.index({ name: 'text' });

export { AccessTokenSchema };

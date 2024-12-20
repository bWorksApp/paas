import { authType } from './../../flatworks/types/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../flatworks/utils/roles';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  email: string;

  @Prop()
  contact: string;

  @Prop()
  gitLink: string;

  @Prop()
  walletAddress: string;

  @Prop({ default: false })
  isShowContact: boolean;

  @Prop({ default: false })
  isShowEmail: boolean;

  @Prop({ default: true })
  issContractDev: boolean;

  @Prop({ default: true })
  isdAppDev: boolean;

  @Prop({ default: 'wallet' })
  authType: authType;

  @Prop()
  walletRewardAddress: string;

  @Prop()
  nonce: string;

  @Prop()
  password: string;

  @Prop()
  userId: string;

  @Prop()
  fullName: string;

  @Prop({ default: true })
  isApproved: boolean;

  @Prop({ default: true })
  isNotified: boolean;

  @Prop()
  refreshToken: string;

  @Prop()
  roles: Role[];

  @Prop()
  skills: any[];

  @Prop()
  description: string;

  @Prop()
  completedAt?: Date;

  @Prop({ required: true })
  createdAt?: Date;

  @Prop()
  deletedAt?: Date;
}

const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index(
  {
    username: 'text',
    fullName: 'text',
    email: 'text',
    description: 'text',
  },
  {
    weights: {
      username: 1,
      fullName: 1,
      email: 1,
      description: 1,
    },
    name: 'textIndex',
  },
);

export { UserSchema };

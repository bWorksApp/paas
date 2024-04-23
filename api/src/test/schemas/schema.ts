import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';
import { Schema as MongooseSchema } from 'mongoose';

export type TestDocument = Test & Document;

@Schema()
export class Test {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  gitRepo: any;

  @Prop()
  isCompiled: boolean;

  @Prop()
  isSourceCodeVerified: boolean;

  @Prop({ type: MongooseSchema.Types.Mixed })
  compiledContract: any;

  @Prop({ type: MongooseSchema.Types.Mixed })
  contract: any;

  @Prop()
  description: string;

  @Prop()
  contractType: string;

  @Prop()
  completedAt?: Date;

  @Prop()
  createdAt?: Date;
}

const TestSchema = SchemaFactory.createForClass(Test);
TestSchema.plugin(uniqueValidator);

export { TestSchema };

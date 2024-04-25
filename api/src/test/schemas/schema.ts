import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

export type TestDocument = Test & Document;

@Schema()
export class Test {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  completedAt?: Date;

  @Prop()
  createdAt?: Date;
}

const TestSchema = SchemaFactory.createForClass(Test);
TestSchema.plugin(uniqueValidator);

export { TestSchema };

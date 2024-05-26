import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NewsDocument = News & Document;

@Schema()
export class News {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  isActive: boolean;

  @Prop()
  description: string;

  @Prop()
  completedAt?: Date;

  @Prop()
  createdAt?: Date;
}

const NewsSchema = SchemaFactory.createForClass(News);
NewsSchema.index({ name: 'text' });

export { NewsSchema };

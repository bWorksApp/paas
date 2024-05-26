import { Module } from '@nestjs/common';
import { NewsService } from './service';
import { NewsController } from './controller';
import { MongooseModule } from '@nestjs/mongoose';
import { News, NewsSchema } from './schemas/schema';

@Module({
  providers: [NewsService],
  controllers: [NewsController],
  exports: [NewsService],
  imports: [
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
  ],
})
export class NewsModule {}

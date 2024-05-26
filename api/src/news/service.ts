import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNewsDto } from './dto/create.dto';
import { UpdateNewsDto } from './dto/update.dto';
import { News, NewsDocument } from './schemas/schema';
import { RaList, MongooseQuery } from '../flatworks/types/types';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private readonly model: Model<NewsDocument>,
  ) {}

  async findAll(query: MongooseQuery): Promise<RaList> {
    const count = await this.model.find(query.filter).count().exec();
    const data = await this.model
      .find(query.filter)
      .sort(query.sort)
      .skip(query.skip)
      .limit(query.limit)
      .exec();

    return { count: count, data: data };
  }

  async findOne(id: string): Promise<News> {
    return await this.model.findById(id).exec();
  }

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const result = await new this.model({
      ...createNewsDto,
      createdAt: new Date(),
    }).save();

    return result;
  }

  async update(id: string, updateNewsDto: UpdateNewsDto): Promise<News> {
    return await this.model
      .findByIdAndUpdate(id, updateNewsDto, { new: true })
      .exec();
  }

  async findByIdAndUpdate(
    id: string,
    updateNewsDto: UpdateNewsDto,
  ): Promise<News> {
    return await this.model.findByIdAndUpdate(id, updateNewsDto).exec();
  }

  async delete(id: string): Promise<News> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}

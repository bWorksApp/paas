import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTestDto } from './dto/create.dto';
import { UpdateTestDto } from './dto/update.dto';
import { Test, TestDocument } from './schemas/schema';
import { RaList, MongooseQuery } from '../flatworks/types/types';

import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class TestService {
  constructor(
    @InjectModel(Test.name) private readonly model: Model<TestDocument>,
    @InjectQueue('queue') private readonly QueueQueue: Queue,
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

  async findOne(id: string): Promise<Test> {
    return await this.model.findById(id).exec();
  }

  async create(createTestDto: CreateTestDto): Promise<Test> {
    const result = await new this.model({
      ...createTestDto,
      createdAt: new Date(),
    }).save();

    return result;
  }

  async update(id: string, updateTestDto: UpdateTestDto): Promise<Test> {
    return await this.model
      .findByIdAndUpdate(id, updateTestDto, { new: true })
      .exec();
  }

  async findByIdAndUpdate(
    id: string,
    updateTestDto: UpdateTestDto,
  ): Promise<Test> {
    return await this.model.findByIdAndUpdate(id, updateTestDto).exec();
  }

  async delete(id: string): Promise<Test> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}

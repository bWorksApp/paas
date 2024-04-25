import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccessToken, AccessTokenDocument } from './schemas/schema';
import { RaList, MongooseQuery } from '../flatworks/types/types';
import { CreateAccessTokenDto } from './dto/create.dto';

@Injectable()
export class AccessTokenService {
  constructor(
    @InjectModel(AccessToken.name)
    private readonly model: Model<AccessTokenDocument>,
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

  async findOne(id: string): Promise<AccessToken> {
    return await this.model.findById(id).exec();
  }

  async create(createAccessTokenDto: CreateAccessTokenDto): Promise<any> {
    return await new this.model({
      ...createAccessTokenDto,
      createdAt: new Date(),
    }).save();
  }

  async delete(id: string): Promise<AccessToken> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}

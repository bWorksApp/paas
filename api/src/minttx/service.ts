import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMintDto } from './dto/create.dto';
import { UpdateMintDto } from './dto/update.dto';
import { Mint, MintDocument } from './schemas/schema';
import { RaList, MongooseQuery } from '../flatworks/types/types';
import {
  sumTxsByMonth,
  sumdAppTxsByUser,
  sumdAppTxs as sumdAppTxsScript,
} from '../flatworks/dbcripts/aggregate.scripts';
import * as moment from 'moment';

@Injectable()
export class MintService {
  constructor(
    @InjectModel(Mint.name) private readonly model: Model<MintDocument>,
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


  async findOne(id: string): Promise<Mint> {
    return await this.model.findById(id).exec();
  }

  async create(createMintDto: CreateMintDto): Promise<Mint> {
    return await new this.model({
      ...createMintDto,
      createdAt: new Date(),
    }).save();
  }


}

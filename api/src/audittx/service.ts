import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuditTxDto } from './dto/create.dto';
import { UpdateAuditTxDto } from './dto/update.dto';
import { AuditTx, AuditTxDocument } from './schemas/schema';
import { RaList, MongooseQuery } from '../flatworks/types/types';

@Injectable()
export class AuditTxService {
  constructor(
    @InjectModel(AuditTx.name) private readonly model: Model<AuditTxDocument>,
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

  async findOne(id: string): Promise<AuditTx> {
    return await this.model.findById(id).exec();
  }

  async create(createAuditTxDto: CreateAuditTxDto): Promise<AuditTx> {
    return await new this.model({
      ...createAuditTxDto,
      createdAt: new Date(),
    }).save();
  }

  
  async update(
    id: string,
    updateAuditTxDto: UpdateAuditTxDto,
  ): Promise<AuditTx> {
    return await this.model.findByIdAndUpdate(id, updateAuditTxDto).exec();
  }

  async findByTxHashAndUpdate(
    lockedTxHash: string,
    updateAuditTxDto: UpdateAuditTxDto,
  ): Promise<AuditTx> {
    return await this.model
      .findOneAndUpdate({ lockedTxHash: lockedTxHash }, updateAuditTxDto)
      .exec();
  }

  async delete(id: string): Promise<AuditTx> {
    return await this.model.findByIdAndDelete(id).exec();
  }

  async count(filter): Promise<any> {
    return await this.model.find(filter).count().exec();
  }
}

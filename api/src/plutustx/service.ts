import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlutusTxDto } from './dto/create.dto';
import { UpdatePlutusTxDto } from './dto/update.dto';
import { PlutusTx, PlutusTxDocument } from './schemas/schema';
import { RaList, MongooseQuery } from '../flatworks/types/types';
import {
  sumTxsByMonth,
  sumdAppTxsByUser,
  sumdAppTxs as sumdAppTxsScript,
} from '../flatworks/dbcripts/aggregate.scripts';
import * as moment from 'moment';

@Injectable()
export class PlutusTxService {
  constructor(
    @InjectModel(PlutusTx.name) private readonly model: Model<PlutusTxDocument>,
  ) {}

  async sumdAppTxsByUser(userId): Promise<any> {
    const aggregateScript = sumdAppTxsByUser(userId);
    const result = await this.model.aggregate(aggregateScript);

    const emptyRecord = {
      _id: 'plutusTxsByUser',
      sumLockedAmounts: 0,
      numberOfLockTxs: 0,
      sumUnlockedAmounts: 0,
      numberOfUnlockedTxs: 0,
    };

    if (result && result.length) {
      return result[0];
    }

    return emptyRecord;
  }

  async sumdAppTxs(): Promise<any> {
    const result = await this.model.aggregate(sumdAppTxsScript);
    const emptyRecord = {
      _id: 'sumdAppTxs',
      sumLockedAmounts: 0,
      numberOfLockTxs: 0,
      sumUnlockedAmounts: 0,
      numberOfUnlockedTxs: 0,
    };

    if (result && result.length) {
      return result[0];
    }

    return emptyRecord;
  }

  async sumTxsByMonth(): Promise<any> {
    const toDate = moment().toDate();
    const fromDate = moment().subtract(1, 'year').toDate();

    const months = [];
    for (let i = 0; i < 12; i++) {
      const month = moment().subtract(i, 'month').format('M-YYYY').toString();
      const shortYear = moment()
        .subtract(i, 'month')
        .format('MM-YY')
        .toString();
      const date = moment().subtract(i, 'month').toDate();
      months.push({ _id: month, shortYear, date });
    }
    const aggregateScript = sumTxsByMonth(fromDate, toDate);
    const _result = await this.model.aggregate(aggregateScript);

    const emptyRecord = {
      _id: '',
      date: '',
      sumLockedAmounts: 0,
      numberOfLockTxs: 0,
      sumUnlockedAmounts: 0,
      numberOfUnlockedTxs: 0,
    };

    const result = months.map((item) => {
      const jobItem = _result.find((jobItem) => jobItem._id == item._id);
      if (jobItem) {
        return { ...jobItem, shortYear: item.shortYear };
      }

      return { ...emptyRecord, ...item };
    });
    return result.reverse();
  }

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

  async findYourTxs(query: MongooseQuery, userId): Promise<RaList> {
    if (!userId) return { count: 0, data: [] };

    const filter = {
      ...query.filter,
      $or: [{ lockUserId: userId }, { unlockUserId: userId }],
    };

    const count = await this.model.find(filter).count().exec();
    const data = await this.model
      .find(filter)
      .sort(query.sort)
      .skip(query.skip)
      .limit(query.limit)
      .exec();

    return { count: count, data: data };
  }

  async findOne(id: string): Promise<PlutusTx> {
    return await this.model.findById(id).exec();
  }

  async create(createPlutusTxDto: CreatePlutusTxDto): Promise<PlutusTx> {
    return await new this.model({
      ...createPlutusTxDto,
      createdAt: new Date(),
    }).save();
  }

  async update(
    id: string,
    updatePlutusTxDto: UpdatePlutusTxDto,
  ): Promise<PlutusTx> {
    return await this.model.findByIdAndUpdate(id, updatePlutusTxDto).exec();
  }

  async findByScriptTxHashAndUpdate(
    scriptTxHash: string,
    updatePlutusTxDto: UpdatePlutusTxDto,
  ): Promise<PlutusTx> {
    return await this.model
      .findOneAndUpdate({ lockedTxHash: scriptTxHash }, updatePlutusTxDto)
      .exec();
  }

  async delete(id: string): Promise<PlutusTx> {
    return await this.model.findByIdAndDelete(id).exec();
  }

  //count for global app search
  async count(filter): Promise<any> {
    return await this.model.find(filter).count().exec();
  }
}

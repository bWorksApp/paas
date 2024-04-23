import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateContractDto } from './dto/create.dto';
import { UpdateContractDto } from './dto/update.dto';
import { Contract, ContractDocument } from './schemas/schema';
import { RaList, MongooseQuery } from '../flatworks/types/types';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ContractType } from '../flatworks/types/types';
import {
  sumContracts,
  sumContractAndTxsByUser,
} from '../flatworks/dbcripts/aggregate.scripts';

/*
- Publish flow
  - user post compiled contract with github repo
    - compile source code to verify the posted compiled contract
    - audit described contract validators through UI
    - once two of above are verified then mark contract as approved 

- Edit and delete permissions
  - approved contract will not allow to update contract body 
  (the part that use for dApp to lock and unlock transaction) and delete. 
  This to make sure it is always available for transactions

- Distribution flow
  - users are able to get contracts as pending audit source code, functions and approval
  - It should uses only approved contracts

  */

@Injectable()
export class ContractService {
  constructor(
    @InjectModel(Contract.name) private readonly model: Model<ContractDocument>,
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

  async findOne(id: string): Promise<Contract> {
    return await this.model.findById(id).exec();
  }

  async create(createContractDto: CreateContractDto): Promise<Contract> {
    const contract = await new this.model({
      ...createContractDto,
      isSourceCodeVerified: false,
      isFunctionVerified: false,
      isApproved: false,
      isCompiled: false,
      createdAt: new Date(),
    }).save();

    if (contract) {
      this.QueueQueue.add('compileContract', contract);
    }

    return contract;
  }

  async update(
    id: string,
    updateContractDto: UpdateContractDto,
    userId: string,
  ): Promise<Contract> {
    const contract = await this.findOne(id);
    if (contract.author !== userId)
      throw new BadRequestException(
        'This is not your contract, the action is not allowed',
      );

    //not to update approved contract body
    if (contract.isApproved) {
      return await this.model
        .findByIdAndUpdate(id, {
          ...updateContractDto,
          contract: contract.contract,
        })
        .exec();
    }

    //if contract body is changed, require re-compile, validate source code & functions
    if (contract.contract !== updateContractDto.contract) {
      this.QueueQueue.add('compileContract', contract);
      updateContractDto.isFunctionVerified = false;
      updateContractDto.isSourceCodeVerified = false;
      updateContractDto.isCompiled = false;
      updateContractDto.isApproved = false;
    }

    return await this.model.findByIdAndUpdate(id, updateContractDto).exec();
  }

  async findByIdAndUpdate(id, updateContractDto: UpdateContractDto) {
    return await this.model.findByIdAndUpdate(id, updateContractDto).exec();
  }

  async delete(id: string, userId: string): Promise<Contract> {
    const contract = await this.findOne(id);
    if (contract.author !== userId)
      throw new BadRequestException(
        'This is not your contract, the action is not allowed',
      );
    if (contract.isApproved)
      throw new BadRequestException(
        'This contract is already in use, the action is not allowed',
      );
    return await this.model.findByIdAndDelete(id).exec();
  }

  //count for global app search
  async count(filter): Promise<any> {
    return await this.model.find(filter).count().exec();
  }

  async sumContracts(): Promise<any> {
    const result = await this.model.aggregate(sumContracts);
    if (result && result.length) {
      return result[0];
    }

    return {};
  }

  async sumContractAndTxByUser(userId: string): Promise<any> {
    const script = sumContractAndTxsByUser(userId);
    const result = await this.model.aggregate(script);
    if (result && result.length) {
      return result[0];
    }

    return {};
  }
}

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccessToken, AccessTokenDocument } from './schemas/schema';
import { RaList, MongooseQuery } from '../flatworks/types/types';
import { CreateAccessTokenDto } from './dto/create.dto';
import { UpdateAccessTokenDto } from './dto/update.dto';
import { AuthService } from '../auth/auth.service';
import * as moment from 'moment';

@Injectable()
export class AccessTokenService {
  constructor(
    @InjectModel(AccessToken.name)
    private readonly model: Model<AccessTokenDocument>,
    private readonly authService: AuthService,
  ) {}

  async findAll(query: MongooseQuery, userId: string): Promise<RaList> {
    const filter = { ...query.filter, userId };
    const count = await this.model.find(filter).count().exec();
    const data = await this.model
      .find(filter)
      .sort(query.sort)
      .skip(query.skip)
      .limit(query.limit)
      .exec();

    return { count: count, data: data };
  }

  async findOne(id: string): Promise<AccessToken> {
    return await this.model.findById(id).exec();
  }

  async create(
    createAccessTokenDto: CreateAccessTokenDto,
    userId,
  ): Promise<any> {
    const expire = moment().add(1, 'years').toDate();
    const token = await this.authService.genDAppToken(userId);
    return await new this.model({
      ...createAccessTokenDto,
      token,
      expire,
      userId,
      createdAt: new Date(),
    }).save();
  }

  //not to update token
  async update(
    id: string,
    updateAccessTokenDto: UpdateAccessTokenDto,
    userId: string,
  ): Promise<any> {
    const token = await this.findOne(id);
    if (token.userId !== userId)
      throw new BadRequestException(
        'This is not your token, the action is not allowed',
      );

    delete updateAccessTokenDto.token;

    return await this.model
      .findByIdAndUpdate(id, updateAccessTokenDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<AccessToken> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}

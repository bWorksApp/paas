import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTokenReceiverDto } from './dto/create.token-receiver.dto';
import { UpdateTokenReceiverDto } from './dto/update.token-receiver.dto';
import { CreateCampaignDto } from './dto/create.campaign.dto';
import { UpdateCampaignDto } from './dto/update.campaign.dto';
import {
  TokenReceiver,
  TokenReceiverDocument,
} from './schemas/token-receiver.schema';
import { Campaign, CampaignDocument } from './schemas/campaign.schema';
import { RaList, MongooseQuery } from '../flatworks/types/types';
import { validateAddress } from '../flatworks/utils/cardano';
import { validateEmail } from '../flatworks/utils/common';
import { DashboardCardData } from '../flatworks/types/types';
import { PlutusTxService } from '../plutustx/service';
import { UserService } from '../user/user.service';
import { ContractService } from '../contract/service';

@Injectable()
export class PublicService {
  constructor(
    @InjectModel(TokenReceiver.name)
    private readonly token: Model<TokenReceiverDocument>,
    @InjectModel(Campaign.name)
    private readonly campaign: Model<CampaignDocument>,
    private readonly plutusTxService: PlutusTxService,
    private readonly contractService: ContractService,
    private readonly userService: UserService,
  ) {}

  async getDashboardData(): Promise<DashboardCardData> {
    /*
    {
      paidByPlutus: {
        numberOfJobs: 10,
        totalAmount: 100
      },
      activeUsers: {
        contractDevs: 10,
        dAppDevs: 10,
      },
      postedJobs: 
     { postedJobs: 100,
      bids: 1000}
    },
    plutusTxs: {
      lockTxs: 100,
      unlockTxs: 10
    }
  }
    */
    //limit 0, to get all records
    const query = { filter: {}, sort: {}, skip: 0, limit: 0 };

    const plutusTxs = await this.plutusTxService.findAll(query);
    const paidAmount = plutusTxs?.data.reduce(
      (acc, item) => acc + item.amount || 0,
      0,
    );

    const hasUnlockTxs = plutusTxs.data.filter((item) => !!item.unlockedTxHash);
    const contractDevQuery = {
      filter: { isSmartContractDev: true },
      sort: {},
      skip: 0,
      limit: 0,
    };
    const dAppDevQuery = {
      filter: { isdAppDev: true },
      sort: {},
      skip: 0,
      limit: 0,
    };

    const contractDevs = await this.userService.findAllList(contractDevQuery);
    const dAppDevs = await this.userService.findAllList(dAppDevQuery);

    const postedJobs = await this.contractService.findAll(query);
    const jobBids = await this.contractService.findAll(query);

    const data = {
      paidByPlutus: {
        numberOfJobs: plutusTxs.data.length || 0,
        totalAmount: paidAmount,
      },
      activeUsers: {
        contractDevs: contractDevs.count,
        dAppDevs: dAppDevs.count,
      },

      publishedContracts: {
        publishedContracts: postedJobs.count,
        approvedContracts: jobBids.count,
      },

      plutusTxs: {
        lockTxs: plutusTxs.count,
        unlockTxs: hasUnlockTxs.length,
      },
    };
    return data;
  }

  async findAllTokenReceiver(query: MongooseQuery): Promise<RaList> {
    const count = await this.token.find(query.filter).count().exec();
    const data = await this.token
      .find(query.filter)
      .sort(query.sort)
      .skip(query.skip)
      .limit(query.limit)
      .exec();

    return { count: count, data: data };
  }

  async findTokenReceiverById(id: string): Promise<TokenReceiver> {
    return await this.token.findById(id).exec();
  }

  async createTokenReceiver(
    createTokenReceiverDto: CreateTokenReceiverDto,
  ): Promise<TokenReceiver> {
    const activeCampaign = await this.findOneCampaign({ isActive: true });

    const isAddress = await validateAddress(createTokenReceiverDto.address);
    const isEmail = validateEmail(createTokenReceiverDto.email);
    if (!isEmail) {
      throw new HttpException('Not a valid email', HttpStatus.NOT_ACCEPTABLE);
    }

    if (!activeCampaign) {
      throw new HttpException('No active campaign', HttpStatus.NOT_FOUND);
    }
    if (!isAddress) {
      throw new HttpException(
        'Not a valid Cardano wallet address',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    return await new this.token({
      ...createTokenReceiverDto,
      campaignId: activeCampaign._id,
      createdAt: new Date(),
    }).save();
  }

  async updateTokenReceiver(
    id: string,
    updateTokenReceiverDto: UpdateTokenReceiverDto,
  ): Promise<TokenReceiver> {
    return await this.token
      .findByIdAndUpdate(id, updateTokenReceiverDto)
      .exec();
  }

  async deleteTokenReceiver(id: string): Promise<TokenReceiver> {
    return await this.token.findByIdAndDelete(id).exec();
  }

  async findAllCampaign(query: MongooseQuery): Promise<RaList> {
    const count = await this.campaign.find(query.filter).count().exec();

    const data = await this.campaign
      .find(query.filter)
      .sort(query.sort)
      .skip(query.skip)
      .limit(query.limit)
      .exec();

    return { count: count, data: data };
  }

  async findCampaignById(id: string): Promise<Campaign> {
    return await this.campaign.findById(id).exec();
  }

  async findOneCampaign(filter = {}): Promise<CampaignDocument> {
    return await this.campaign.findOne(filter).exec();
  }

  async createCampaign(
    createCampaignDto: CreateCampaignDto,
  ): Promise<Campaign> {
    return await new this.campaign({
      ...createCampaignDto,
      createdAt: new Date(),
    }).save();
  }

  async updateCampaign(
    id: string,
    updateCampaignDto: UpdateCampaignDto,
  ): Promise<Campaign> {
    return await this.campaign.findByIdAndUpdate(id, updateCampaignDto).exec();
  }

  async deleteCampaign(id: string): Promise<Campaign> {
    return await this.campaign.findByIdAndDelete(id).exec();
  }
}

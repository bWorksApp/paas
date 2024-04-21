import { UserService } from '../user/user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Response,
  Query,
} from '@nestjs/common';
import { CreateTokenReceiverDto } from './dto/create.token-receiver.dto';
import { UpdateTokenReceiverDto } from './dto/update.token-receiver.dto';
import { PublicService } from './public.service';
import { queryTransform, formatRaList } from '../flatworks/utils/getlist';
import { CreateCampaignDto } from './dto/create.campaign.dto';
import { UpdateCampaignDto } from './dto/update.campaign.dto';
import { PlutusTxService } from '../plutustx/service';
import * as moment from 'moment';
import { Public } from '../flatworks/roles/public.api.decorator';

@Public()
@Controller('public')
export class PublicController {
  constructor(
    private readonly service: PublicService,
    private readonly plutusTxService: PlutusTxService,
    private readonly userService: UserService,
  ) {}

  //dashboard user statistic
  @Get('sumUsers')
  async getSumUsers(@Response() res: any) {
    const result = await this.userService.sumUsers();
    return res.json(result);
  }

  //dashboard apis
  @Get('dashboardcards')
  async getDashboardData(@Response() res: any) {
    const result = await this.service.getDashboardData();
    return res.json(result);
  }
}

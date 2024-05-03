import { Controller, Get, Response, UseGuards, Req } from '@nestjs/common';
import { PublicService } from './public.service';
import * as moment from 'moment';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as lodash from 'lodash';
import { PlutusTxService } from '../plutustx/service';
import { ContractService } from '../contract/service';
import { UserService } from '../user/user.service';

@UseGuards(JwtAuthGuard)
@Controller('customapis')
export class CustomController {
  constructor(
    private readonly service: PublicService,
    private readonly plutusTxService: PlutusTxService,
    private readonly userService: UserService,
    private readonly contractService: ContractService,
  ) {}

  //dashboard apis
  @Get('dashboardcards')
  async getDashboardData(@Response() res: any) {
    const result = await this.service.getDashboardData();
    return res.json(result);
  }

  //Sum published contract by month
  @Get('sumpublishedcontractbymonth')
  async getDashboardContract(@Response() res: any) {
    const result = await this.contractService.sumPublishedContractByMonth();
    return res.json(result);
  }

  //get userId from access token
  @Get('userid')
  async getUserId(@Response() res: any, @Req() request) {
    const userId = lodash.get(request, 'user.userId', null);
    return res.json(userId);
  }

  //sum users
  @Get('sumusers')
  async getSumUsers(@Response() res: any) {
    const result = await this.userService.sumUsers();
    return res.json(result);
  }

  //sum contracts
  @Get('sumcontracts')
  async getSumContracts(@Response() res: any) {
    const result = await this.contractService.sumContracts();
    return res.json(result);
  }

  //sum dApp Txs
  @Get('sumdapptxs')
  async getSumDAppTxs(@Response() res: any) {
    const result = await this.plutusTxService.sumdAppTxs();
    return res.json(result);
  }

  //sum dAppTxs by month
  @Get('sumtxsbymonth')
  async getSumTxs(@Response() res: any) {
    const result = await this.plutusTxService.sumTxsByMonth();
    return res.json(result);
  }

  //sum published contract and contract TXs by a user
  @Get('sumcontractandtxbyuser')
  async sumContractAndTxByUser(@Response() res: any, @Req() request) {
    const userId = lodash.get(request, 'user.userId', null);
    const result = await this.contractService.sumContractAndTxByUser(userId);
    return res.json(result);
  }

  //sum dApp TXs by user
  @Get('sumdAppTxsByUser')
  async sumdAppTxsByUser(@Response() res: any, @Req() request) {
    const userId = lodash.get(request, 'user.userId', null);
    const result = await this.plutusTxService.sumdAppTxsByUser(userId);
    return res.json(result);
  }
}

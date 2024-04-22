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
import { PublicService } from './public.service';
import { PlutusTxService } from '../plutustx/service';
import { ContractService } from '../contract/service';
import { Public } from '../flatworks/roles/public.api.decorator';

@Public()
@Controller('public')
export class PublicController {
  constructor(
    private readonly service: PublicService,
    private readonly plutusTxService: PlutusTxService,
    private readonly userService: UserService,
    private readonly contractService: ContractService,
  ) {}

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

  //sum dAppTxs by month
  @Get('sumtxsbymonth')
  async getSumTxs(@Response() res: any) {
    const result = await this.plutusTxService.sumTxsByMonth();
    return res.json(result);
  }

  //sum published contract and contract TXs by a user
  @Get('sumcontractandtxbyuser')
  async sumContractAndTxByUser(@Response() res: any) {
    const userId = '6603d0afe9aceb37b1bb6ced';
    const result = await this.contractService.sumContractAndTxByUser(userId);
    return res.json(result);
  }

  @Get('sumdAppTxsByUser')
  async sumdAppTxsByUser(@Response() res: any) {
    const userId = '6603d0afe9aceb37b1bb6ced';
    const result = await this.plutusTxService.sumdAppTxsByUser(userId);
    return res.json(result);
  }
}

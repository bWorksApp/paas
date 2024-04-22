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

  //dashboard apis
  @Get('dashboardcards')
  async getDashboardData(@Response() res: any) {
    const result = await this.service.getDashboardData();
    return res.json(result);
  }
}

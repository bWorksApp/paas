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
  UseGuards,
  Req,
} from '@nestjs/common';
import { PublicService } from './public.service';
import { PlutusTxService } from '../plutustx/service';
import * as moment from 'moment';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as lodash from 'lodash';
import { queryTransform } from '../flatworks/utils/getlist';

@UseGuards(JwtAuthGuard)
@Controller('customapis')
export class CustomController {
  constructor(private readonly plutusTxService: PlutusTxService) {}

  //get userId from access token
  @Get('userid')
  async getUserId(@Response() res: any, @Req() request) {
    const userId = lodash.get(request, 'user.userId', null);
    return res.json(userId);
  }
}

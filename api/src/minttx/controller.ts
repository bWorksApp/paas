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
  Request,
} from '@nestjs/common';
import { CreateMintDto } from './dto/create.dto';
import { UpdateMintDto } from './dto/update.dto';
import { MintService } from './service';
import { queryTransform, formatRaList } from '../flatworks/utils/getlist';
import * as lodash from 'lodash';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('mintassets')
export class MintController {
  constructor(private readonly service: MintService) {}

  @Get()
  async index(@Response() res: any, @Query() query, @Req() request) {
    const mongooseQuery = queryTransform(query);
    const result = await this.service.findAll(mongooseQuery);
    return formatRaList(res, result);
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    return await this.service.findOne(id);
  }

  @Post()
  async create(@Body() createMintDto: CreateMintDto, @Request() req) {
    const userId = req.user.userId;
    return await this.service.create({
      ...createMintDto,
      mintedByUserId: userId,
      mintDate: new Date(),
    });
  }
}

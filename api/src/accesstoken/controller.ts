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
  Request,
} from '@nestjs/common';
import { CreateAccessTokenDto } from './dto/create.dto';
import { AccessTokenService } from './service';
import { queryTransform, formatRaList } from '../flatworks/utils/getlist';
import { UpdateAccessTokenDto } from './dto/update.dto';

@Controller('accesstokens')
export class AccessTokenController {
  constructor(private readonly service: AccessTokenService) {}

  @Get()
  async index(@Response() res: any, @Query() query) {
    const mongooseQuery = queryTransform(query);
    const result = await this.service.findAll(mongooseQuery);
    return formatRaList(res, result);
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    return await this.service.findOne(id);
  }

  @Post()
  async create(
    @Body() createAccessTokenDto: CreateAccessTokenDto,
    @Request() req,
  ) {
    const userId = req.user['userId'];
    return await this.service.create(createAccessTokenDto, userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAccessTokenDto: UpdateAccessTokenDto,
    @Request() req,
  ) {
    const userId = req.user['userId'];
    return await this.service.update(id, updateAccessTokenDto, userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }
}

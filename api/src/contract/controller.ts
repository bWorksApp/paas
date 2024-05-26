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
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateContractDto } from './dto/create.dto';
import { UpdateContractDto } from './dto/update.dto';
import { ContractService } from './service';
import { queryTransform, formatRaList } from '../flatworks/utils/getlist';
import { Roles } from '../flatworks/roles/roles.decorator';
import { Role } from '../flatworks/types/types';

@Controller('contracts')
export class ContractController {
  constructor(private readonly service: ContractService) {}

  @Get()
  async index(@Response() res: any, @Query() query, @Request() req) {
    const mongooseQuery = queryTransform(query);
    delete mongooseQuery.filter.queryType;
    const result = await this.service.findAll(mongooseQuery);
    return formatRaList(res, result);
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    return await this.service.findOne(id);
  }

  @Post()
  async create(@Body() createContractDto: CreateContractDto, @Request() req) {
    const userId = req.user.userId;
    return await this.service.create({ ...createContractDto, author: userId });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
    @Request() req,
  ) {
    const userId = req.user['userId'];
    return await this.service.update(id, updateContractDto, userId);
  }

  //cms only
  @Roles(Role.Admin)
  @Put('/approve/:id')
  async approve(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return await this.service.approve(id, updateContractDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const userId = req.user['userId'];
    return await this.service.delete(id, userId);
  }
}

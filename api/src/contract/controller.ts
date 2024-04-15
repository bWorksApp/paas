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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('contracts')
export class ContractController {
  constructor(private readonly service: ContractService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async index(@Response() res: any, @Query() query, @Request() req) {
    //   const userId = req.user.userId;
    const mongooseQuery = queryTransform(query);
    /*  mongooseQuery.filter.queryType === 'developer'
      ? (mongooseQuery.filter.author = userId)
      : null; */
    delete mongooseQuery.filter.queryType;
    const result = await this.service.findAll(mongooseQuery);

    return formatRaList(res, result);
  }

  @Get('/getall')
  async getAll(@Response() res: any, @Query() query, @Request() req) {
    const mongooseQuery = queryTransform(query);

    const result = await this.service.findAll(mongooseQuery);
    return formatRaList(res, result);
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    return await this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createContractDto: CreateContractDto, @Request() req) {
    const userId = req.user.userId;
    return await this.service.create({ ...createContractDto, author: userId });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
    @Request() req,
  ) {
    const userId = req.user['userId'];
    return await this.service.update(id, updateContractDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const userId = req.user['userId'];
    return await this.service.delete(id, userId);
  }
}

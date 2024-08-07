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
} from '@nestjs/common';
import { CreateContractDto } from './dto/create.dto';
import { UpdateContractDto } from './dto/update.dto';
import { ContractService } from './service';
import { queryTransform, formatRaList } from '../flatworks/utils/getlist';

@Controller('publishcontracts')
export class PublishContractController {
  constructor(private readonly service: ContractService) {}

  @Get()
  async index(@Response() res: any, @Query() query, @Request() req) {
    const userId = req.user.userId;
    const mongooseQuery = queryTransform(query);
    mongooseQuery.filter.author = userId;
    const result = await this.service.findAll(mongooseQuery);

    return formatRaList(res, result);
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    return await this.service.findOne(id);
  }

  @Post()
  async create(@Body() createContractDto: CreateContractDto, @Request() req) {
    console.log(createContractDto);
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

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const userId = req.user['userId'];
    return await this.service.delete(id, userId);
  }
}

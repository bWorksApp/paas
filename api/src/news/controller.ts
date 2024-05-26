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
  Req,
  Request,
} from '@nestjs/common';
import { CreateNewsDto } from './dto/create.dto';
import { UpdateNewsDto } from './dto/update.dto';
import { NewsService } from './service';
import { queryTransform, formatRaList } from '../flatworks/utils/getlist';
import { Roles } from '../flatworks/roles/roles.decorator';
import { Role } from '../flatworks/types/types';

@Controller('news')
@Roles(Role.Admin)
export class NewsController {
  constructor(private readonly service: NewsService) {}

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
  async create(@Body() createNewsDto: CreateNewsDto, @Request() req) {
    const result = await this.service.create({
      ...createNewsDto,
    });

    return result;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return await this.service.update(id, updateNewsDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }
}

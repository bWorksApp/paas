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
import { CreateTestDto } from './dto/create.dto';
import { UpdateTestDto } from './dto/update.dto';
import { TestService } from './service';
import { queryTransform, formatRaList } from '../flatworks/utils/getlist';
import * as lodash from 'lodash';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../flatworks/roles/public.api.decorator';

@Public()
@Controller('tests')
export class TestController {
  constructor(private readonly service: TestService) {}

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
  /*

*/
  @Post()
  async create(@Body() createTestDto: CreateTestDto, @Request() req) {
    const result = await this.service.create({
      ...createTestDto,
    });

    return result;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
    return await this.service.update(id, updateTestDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }
}

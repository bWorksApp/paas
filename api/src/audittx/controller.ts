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
import { CreateAuditTxDto } from './dto/create.dto';
import { UpdateAuditTxDto } from './dto/update.dto';
import { AuditTxService } from './service';
import { queryTransform, formatRaList } from '../flatworks/utils/getlist';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../flatworks/roles/roles.decorator';
import { Role } from '../flatworks/types/types';

@UseGuards(JwtAuthGuard)
@Controller('audittxs')
export class AuditTxController {
  constructor(private readonly service: AuditTxService) {}

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
  async create(@Body() createAuditTxDto: CreateAuditTxDto, @Request() req) {
    const userId = req.user.userId;
    return await this.service.create({
      ...createAuditTxDto,
      lockUserId: userId,
      lockDate: new Date(),
    });
  }
  @Roles(Role.Admin)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAuditTxDto: UpdateAuditTxDto,
  ) {
    return await this.service.update(id, updateAuditTxDto);
  }

  @Put('/unlock/:lockedTxHash')
  async updateTx(
    @Param('lockedTxHash') lockedTxHash: string,
    @Body() updateAuditTxDto: UpdateAuditTxDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return await this.service.findByTxHashAndUpdate(lockedTxHash, {
      ...updateAuditTxDto,
      unlockUserId: userId,
      unlockDate: new Date(),
    });
  }

  //only admin can delete
  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }
}

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
  BadRequestException,
} from '@nestjs/common';
import { Public } from '../flatworks/roles/public.api.decorator';
import { queryTransform, formatRaList } from '../flatworks/utils/getlist';
import { PublicService } from './public.service';
import { NewsService } from '../news/service';
import { fetchUtxo } from '../flatworks/utils/cardano';
@Public()
@Controller('public')
export class PublicController {
  constructor(
    private readonly userService: UserService,
    private readonly publicService: PublicService,
    private readonly newsService: NewsService,
  ) {}

  //nonce for wallet authenticate
  @Get('getnonce')
  async getUserNonce(@Response() res: any, @Query() query) {
    const walletRewardAddress =
      queryTransform(query).filter.walletRewardAddress;
    console.log(walletRewardAddress);
    if (!walletRewardAddress)
      throw new BadRequestException('Not a registered wallet');
    const result = await this.userService.findNonce(walletRewardAddress);
    return res.json(result);
  }

  //find utxo
  @Get('findutxo')
  async findUtxo(@Response() res: any, @Query() query) {
    const { scriptAddress, asset, lockedTxHash } = queryTransform(query).filter;
    console.log(scriptAddress, asset, lockedTxHash);
    if (!scriptAddress) throw new BadRequestException('No script address');
    if (!asset) throw new BadRequestException('No asset name');
    if (!lockedTxHash) throw new BadRequestException('No lockedTxHash');

    const result = await fetchUtxo(scriptAddress, asset, lockedTxHash);
    if (!result) throw new BadRequestException('No UTXO');
    return res.json(result);
  }

  @Get('news')
  async getNews(@Response() res: any, @Query() query) {
    const mongooseQuery = queryTransform(query);
    const result = await this.newsService.findAll(mongooseQuery);
    return formatRaList(res, result);
  }
}

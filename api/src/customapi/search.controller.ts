import { Controller, Get, Response, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { queryTransform } from '../flatworks/utils/getlist';

@Controller('customapis')
export class SearchController {
  constructor(private readonly service: SearchService) {}

  //http://localhost:3000/customapis/searchcms?filter={"text": "xxxxx"}
  @Get('searchcms')
  async indexCms(@Response() res: any, @Query() query) {
    const mongooseQuery = queryTransform(query);
    const result: any = await this.service.findAllCms(mongooseQuery.filter);
    return res.json(result);
  }
  //http://localhost:3000/customapis/searchapp?filter={"text": "xxxxx"}
  @Get('searchapp')
  async indexApp(@Response() res: any, @Query() query) {
    const mongooseQuery = queryTransform(query);
    console.log(mongooseQuery);
    const result: any = await this.service.findAllApp(mongooseQuery.filter);
    return res.json(result);
  }
}

import { ContractService } from '../contract/service';
import { PlutusTxService } from '../plutustx/service';
import { UserService } from '../user/user.service';

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { cmsSearchConfig, appSearchConfig } from '../flatworks/config/search';
@Injectable()
export class SearchService {
  constructor(
    private readonly contractService: ContractService,
    private readonly plutusTxService: PlutusTxService,
    private readonly userService: UserService,
  ) {}

  //return number of rows
  async findAllCms(filter): Promise<any> {
    const baseUrl = process.env.CMS_BASE_URL;
    const configs = cmsSearchConfig();
    const text = filter.text;
    const results = [];
    await Promise.all(
      configs.map(async (item) => {
        let count = 0;

        try {
          count = await this[item.serviceName].count({
            $text: {
              $search: text,
            },
          });
        } catch (e) {
          console.log('global cms search error!', e);
        }

        count > 0
          ? results.push({
              id: item.subUrl,
              text: `${item.text} ${count} `,
              //encode url before return
              link: encodeURI(
                `${baseUrl}/${item.subUrl}?filter=${JSON.stringify({
                  textSearch: text,
                })}`,
              ),
            })
          : null;
      }),
    );

    return {
      data: results,
      count: results.length,
    };
  }

  //return number of rows
  async findAllApp(filter): Promise<any> {
    const text = filter.text;
    const results = [];
    const baseUrl = process.env.APP_BASE_URL;

    const configs = appSearchConfig();
    await Promise.all(
      configs.map(async (item) => {
        let count = 0;

        try {
          count = await this[item.serviceName].count({
            $text: {
              $search: text,
            },
          });
        } catch (e) {
          console.log('global app search error!', e);
        }

        count > 0
          ? results.push({
              id: item.subUrl,
              text: `${item.text} ${count} `,
              //encode url before return
              link: encodeURI(
                `${baseUrl}/${item.subUrl}?filter=${JSON.stringify({
                  textSearch: text,
                })}`,
              ),
            })
          : null;
      }),
    );

    return {
      data: results,
      count: results.length,
    };
  }
}

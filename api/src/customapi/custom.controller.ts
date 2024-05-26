import { Controller, Get, Response, UseGuards, Req } from '@nestjs/common';
import { PublicService } from './public.service';
import * as moment from 'moment';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as lodash from 'lodash';
import { PlutusTxService } from '../plutustx/service';
import { ContractService } from '../contract/service';
import { UserService } from '../user/user.service';

@UseGuards(JwtAuthGuard)
@Controller('customapis')
export class CustomController {
  constructor(
    private readonly service: PublicService,
    private readonly plutusTxService: PlutusTxService,
    private readonly userService: UserService,
    private readonly contractService: ContractService,
  ) {}

  //dashboard apis
  @Get('dashboardcards')
  async getDashboardData(@Response() res: any) {
    const result = await this.service.getDashboardData();
    return res.json(result);
  }

  //Sum published contract by month
  @Get('sumpublishedcontractbymonth')
  async getDashboardContract(@Response() res: any) {
    const result = await this.contractService.sumPublishedContractByMonth();
    return res.json(result);
  }

  //get userId from access token
  @Get('userid')
  async getUserId(@Response() res: any, @Req() request) {
    const userId = lodash.get(request, 'user.userId', null);
    return res.json(userId);
  }

  //sum users
  @Get('sumusers')
  async getSumUsers(@Response() res: any) {
    const result = await this.userService.sumUsers();
    return res.json(result);
  }

  //sum contracts
  @Get('sumcontracts')
  async getSumContracts(@Response() res: any) {
    const result = await this.contractService.sumContracts();
    return res.json(result);
  }

  //sum dApp Txs
  @Get('sumdapptxs')
  async getSumDAppTxs(@Response() res: any) {
    const result = await this.plutusTxService.sumdAppTxs();
    return res.json(result);
  }

  //sum dAppTxs by month
  @Get('sumtxsbymonth')
  async getSumTxs(@Response() res: any) {
    const result = await this.plutusTxService.sumTxsByMonth();
    return res.json(result);
  }

  //sum published contract and contract TXs by a user
  @Get('sumcontractandtxbyuser')
  async sumContractAndTxByUser(@Response() res: any, @Req() request) {
    const userId = lodash.get(request, 'user.userId', null);
    const result = await this.contractService.sumContractAndTxByUser(userId);
    return res.json(result);
  }

  //sum dApp TXs by user
  @Get('sumdAppTxsByUser')
  async sumdAppTxsByUser(@Response() res: any, @Req() request) {
    const userId = lodash.get(request, 'user.userId', null);
    const result = await this.plutusTxService.sumdAppTxsByUser(userId);
    return res.json(result);
  }
}
/*
http://localhost:3000/customapis/sumpublishedcontractbymonth
[
    {
        "_id": "6-2023",
        "date": "2023-06-23T10:43:38.254Z",
        "numberOfPublishedContracts": 0,
        "numberOfCompiledContracts": 0,
        "numberOfSourceCodeVerifiedContracts": 0,
        "numberOfFunctionVerifiedContracts": 0,
        "numberOfApprovedContracts": 0,
        "shortYear": "06-23"
    }, {
        "_id": "7-2023",
        "date": "2023-07-23T10:43:38.254Z",
        "numberOfPublishedContracts": 0,
        "numberOfCompiledContracts": 0,
        "numberOfSourceCodeVerifiedContracts": 0,
        "numberOfFunctionVerifiedContracts": 0,
        "numberOfApprovedContracts": 0,
        "shortYear": "07-23"
    },
  ]

  http://localhost:3000/customapis/sumcontracts
{
    "_id": "sumContracts",
    "plutusContracts": 11,
    "aikenContracts": 14,
    "marloweContracts": 2,
    "isSourceCodeVerified": 16,
    "isFunctionVerified": 11,
    "isApproved": 5,
    "hasTxContracts": 1
}

http://localhost:3000/customapis/sumdapptxs
{
    "_id": "plutusReports",
    "sumLockedAmounts": 766,
    "numberOfLockTxs": 29,
    "sumUnlockedAmounts": 437,
    "numberOfUnlockedTxs": 14
}

http://localhost:3000/customapis/sumtxsbymonth
[
    {
        "_id": "6-2023",
        "date": "2023-06-06T19:18:23.631Z",
        "sumLockedAmounts": 210,
        "numberOfLockTxs": 9,
        "sumUnlockedAmounts": 114,
        "numberOfUnlockedTxs": 6,
        "shortYear": "06-23"
    },
    {
        "_id": "7-2023",
        "date": "2023-07-05T06:14:03.002Z",
        "sumLockedAmounts": 215,
        "numberOfLockTxs": 4,
        "sumUnlockedAmounts": 0,
        "numberOfUnlockedTxs": 0,
        "shortYear": "07-23"
    },
    {
        "_id": "8-2023",
        "date": "2023-08-23T10:46:10.936Z",
        "sumLockedAmounts": 0,
        "numberOfLockTxs": 0,
        "sumUnlockedAmounts": 0,
        "numberOfUnlockedTxs": 0,
        "shortYear": "08-23"
    },
    {
        "_id": "9-2023",
        "date": "2023-09-23T10:46:10.936Z",
        "sumLockedAmounts": 0,
        "numberOfLockTxs": 0,
        "sumUnlockedAmounts": 0,
        "numberOfUnlockedTxs": 0,
        "shortYear": "09-23"
    },
    {
        "_id": "10-2023",
        "date": "2023-10-23T10:46:10.936Z",
        "sumLockedAmounts": 0,
        "numberOfLockTxs": 0,
        "sumUnlockedAmounts": 0,
        "numberOfUnlockedTxs": 0,
        "shortYear": "10-23"
    },
    {
        "_id": "11-2023",
        "date": "2023-11-26T15:10:59.976Z",
        "sumLockedAmounts": 6,
        "numberOfLockTxs": 2,
        "sumUnlockedAmounts": 3,
        "numberOfUnlockedTxs": 1,
        "shortYear": "11-23"
    },
    {
        "_id": "12-2023",
        "date": "2023-12-01T08:44:34.862Z",
        "sumLockedAmounts": 300,
        "numberOfLockTxs": 1,
        "sumUnlockedAmounts": 300,
        "numberOfUnlockedTxs": 1,
        "shortYear": "12-23"
    },
    {
        "_id": "1-2024",
        "date": "2024-01-23T10:46:10.936Z",
        "sumLockedAmounts": 0,
        "numberOfLockTxs": 0,
        "sumUnlockedAmounts": 0,
        "numberOfUnlockedTxs": 0,
        "shortYear": "01-24"
    },
    {
        "_id": "2-2024",
        "date": "2024-02-23T10:46:10.936Z",
        "sumLockedAmounts": 0,
        "numberOfLockTxs": 0,
        "sumUnlockedAmounts": 0,
        "numberOfUnlockedTxs": 0,
        "shortYear": "02-24"
    },
    {
        "_id": "3-2024",
        "date": "2024-03-23T10:46:10.936Z",
        "sumLockedAmounts": 0,
        "numberOfLockTxs": 0,
        "sumUnlockedAmounts": 0,
        "numberOfUnlockedTxs": 0,
        "shortYear": "03-24"
    },
    {
        "_id": "4-2024",
        "date": "2024-04-23T10:46:10.936Z",
        "sumLockedAmounts": 0,
        "numberOfLockTxs": 0,
        "sumUnlockedAmounts": 0,
        "numberOfUnlockedTxs": 0,
        "shortYear": "04-24"
    },
    {
        "_id": "5-2024",
        "date": "2024-05-23T10:46:10.936Z",
        "sumLockedAmounts": 0,
        "numberOfLockTxs": 0,
        "sumUnlockedAmounts": 0,
        "numberOfUnlockedTxs": 0,
        "shortYear": "05-24"
    }
]

http://localhost:3000/customapis/sumcontractandtxbyuser
{
    "_id": "sumContracts",
    "plutusContracts": 11,
    "aikenContracts": 7,
    "marloweContracts": 2,
    "isSourceCodeVerified": 14,
    "isFunctionVerified": 11,
    "isApproved": 5,
    "hasTxContracts": 1,
    "totalTxs": 2
}

http://localhost:3000/customapis/sumdAppTxsByUser
{
    "_id": "plutusTxsByUser",
    "sumLockedAmounts": 300,
    "numberOfLockTxs": 1,
    "sumUnlockedAmounts": 300,
    "numberOfUnlockedTxs": 1
}
*/

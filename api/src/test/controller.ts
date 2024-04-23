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
sample post data: 
 {
    "name": "plutus",
    "contractType": "plutus",
    "contract": {
    "type": "PlutusScriptV1",
    "description": "",
    "cborHex": "49480100002221200101"
},
    "gitRepo": {
        "gitRepo": "https://github.com/IntersectMBO/plutus-apps",
        "sourceCodeFolder": "plutus-example",
        "buildCommand": "cabal run plutus-example",
        "outputJsonFile": "generated-plutus-scripts/v1/always-succeeds-spending.plutus"
    }
}
//aiken
{
    "name": "aiken",
    "contractType": "aiken",
    "contract": {
        "preamble": {
            "title": "aiken-lang/hello_world",
            "description": "Aiken contracts for project 'aiken-lang/hello_world'",
            "version": "1.0.0",
            "plutusVersion": "v2",
            "compiler": {
                "name": "Aiken",
                "version": "v1.0.24-alpha+982eff4"
            }
        },
        "validators": [
            {
                "title": "hello_world.spend",
                "datum": {
                    "title": "datum",
                    "schema": "DBRef(\"#/definitions/hello_world~1Datum\", undefined)"
                },
                "redeemer": {
                    "title": "redeemer",
                    "schema": "DBRef(\"#/definitions/hello_world~1Redeemer\", undefined)"
                },
                "compiledCode": "58f2010000323232323232323222232325333008323232533300b002100114a06644646600200200644a66602200229404c8c94ccc040cdc78010028a511330040040013014002375c60240026eb0c038c03cc03cc03cc03cc03cc03cc03cc03cc020c008c020014dd71801180400399b8f375c6002600e00a91010d48656c6c6f2c20576f726c6421002300d00114984d958c94ccc020cdc3a400000226464a66601a601e0042930b1bae300d00130060041630060033253330073370e900000089919299980618070010a4c2c6eb8c030004c01401058c01400c8c014dd5000918019baa0015734aae7555cf2ab9f5742ae881",
                "hash": "6fb13cf9efdbe986e784d1983b21d3fb90231c1745925f536a820fb4"
            }
        ],
        "definitions": {
            "ByteArray": {
                "dataType": "bytes"
            },
            "hello_world/Datum": {
                "title": "Datum",
                "anyOf": [
                    {
                        "title": "Datum",
                        "dataType": "constructor",
                        "index": 0,
                        "fields": [
                            {
                                "title": "owner",
                                "$ref": "#/definitions/ByteArray"
                            }
                        ]
                    }
                ]
            },
            "hello_world/Redeemer": {
                "title": "Redeemer",
                "anyOf": [
                    {
                        "title": "Redeemer",
                        "dataType": "constructor",
                        "index": 0,
                        "fields": [
                            {
                                "title": "msg",
                                "$ref": "#/definitions/ByteArray"
                            }
                        ]
                    }
                ]
            }
        }
    },
    "gitRepo": {
        "gitRepo": "https://github.com/aiken-lang/aiken",
        "sourceCodeFolder": "examples/hello_world",
        "buildCommand": "aiken build",
        "outputJsonFile": "plutus.json"
    }
}

//marlowe
{
    "name": "marlowe",
    "contractType": "marlowe",
    "gitRepo": {
        "gitRepo": "https://github.com/jackchuong/test-smart-contract",
        "sourceCodeFolder": "contract.marlowe",
        "buildCommand": "",
        "outputJsonFile": ""
    }
}
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

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateContractDto } from './dto/create.dto';
import { UpdateContractDto } from './dto/update.dto';
import { Contract, ContractDocument } from './schemas/schema';
import { RaList, MongooseQuery } from '../flatworks/types/types';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as lodash from 'lodash';
import {
  sumContracts,
  sumContractAndTxsByUser,
  sumPublishedContractByMonth,
} from '../flatworks/dbcripts/aggregate.scripts';
import * as moment from 'moment';

/*
- Publish flow
  - user post compiled contract with github repo
    - compile source code to verify the posted compiled contract
    - audit described contract validators through UI
    - once two of above are verified then mark contract as approved 

- Edit and delete permissions
  - approved contract will not allow to update contract body 
  (the part that use for dApp to lock and unlock transaction) and delete. 
  This to make sure it is always available for transactions

- Distribution flow
  - users are able to get contracts as pending audit source code, functions and approval
  - It should uses only approved contracts
  */

@Injectable()
export class ContractService {
  constructor(
    @InjectModel(Contract.name) private readonly model: Model<ContractDocument>,
    @InjectQueue('queue') private readonly QueueQueue: Queue,
  ) {}

  async findAll(query: MongooseQuery): Promise<RaList> {
    const count = await this.model.find(query.filter).count().exec();
    const data = await this.model
      .find(query.filter)
      .sort(query.sort)
      .skip(query.skip)
      .limit(query.limit)
      .exec();

    return { count: count, data: data };
  }

  async findOne(id: string): Promise<Contract> {
    return await this.model.findById(id).exec();
  }

  async findByName(name: string): Promise<Contract> {
    return await this.model.findOne({ name: name }).exec();
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
    "contract": {
    "timeout": 1710414441000,
    "timeout_continuation": "close",
    "when": [
      {
        "case": {
          "deposits": 75000000,
          "into_account": {
            "role_token": "Seller"
          },
          "of_token": {
            "currency_symbol": "",
            "token_name": ""
          },
          "party": {
            "role_token": "Buyer"
          }
        },
        "then": {
          "timeout": 1710418041000,
          "timeout_continuation": "close",
          "when": [
            {
              "case": {
                "choose_between": [
                  {
                    "from": 0,
                    "to": 0
                  }
                ],
                "for_choice": {
                  "choice_name": "Everything is alright",
                  "choice_owner": {
                    "role_token": "Buyer"
                  }
                }
              },
              "then": "close"
            },
            {
              "case": {
                "choose_between": [
                  {
                    "from": 1,
                    "to": 1
                  }
                ],
                "for_choice": {
                  "choice_name": "Report problem",
                  "choice_owner": {
                    "role_token": "Buyer"
                  }
                }
              },
              "then": {
                "from_account": {
                  "role_token": "Seller"
                },
                "pay": 75000000,
                "then": {
                  "timeout": 1710421641000,
                  "timeout_continuation": "close",
                  "when": [
                    {
                      "case": {
                        "choose_between": [
                          {
                            "from": 1,
                            "to": 1
                          }
                        ],
                        "for_choice": {
                          "choice_name": "Confirm problem",
                          "choice_owner": {
                            "role_token": "Seller"
                          }
                        }
                      },
                      "then": "close"
                    },
                    {
                      "case": {
                        "choose_between": [
                          {
                            "from": 0,
                            "to": 0
                          }
                        ],
                        "for_choice": {
                          "choice_name": "Dispute problem",
                          "choice_owner": {
                            "role_token": "Seller"
                          }
                        }
                      },
                      "then": {
                        "timeout": 1710425241000,
                        "timeout_continuation": "close",
                        "when": [
                          {
                            "case": {
                              "choose_between": [
                                {
                                  "from": 0,
                                  "to": 0
                                }
                              ],
                              "for_choice": {
                                "choice_name": "Dismiss claim",
                                "choice_owner": {
                                  "role_token": "Mediator"
                                }
                              }
                            },
                            "then": {
                              "from_account": {
                                "role_token": "Buyer"
                              },
                              "pay": 75000000,
                              "then": "close",
                              "to": {
                                "account": {
                                  "role_token": "Seller"
                                }
                              },
                              "token": {
                                "currency_symbol": "",
                                "token_name": ""
                              }
                            }
                          },
                          {
                            "case": {
                              "choose_between": [
                                {
                                  "from": 1,
                                  "to": 1
                                }
                              ],
                              "for_choice": {
                                "choice_name": "Confirm claim",
                                "choice_owner": {
                                  "role_token": "Mediator"
                                }
                              }
                            },
                            "then": "close"
                          }
                        ]
                      }
                    }
                  ]
                },
                "to": {
                  "account": {
                    "role_token": "Buyer"
                  }
                },
                "token": {
                  "currency_symbol": "",
                  "token_name": ""
                }
              }
            }
          ]
        }
      }
    ]
  },
    "gitRepo": {
        "gitRepo": "https://github.com/jackchuong/test-smart-contract",
        "sourceCodeFolder": "contract.marlowe",
        "buildCommand": "",
        "outputJsonFile": ""
    }
}
*/

  async create(createContractDto: CreateContractDto): Promise<Contract> {
    const contract = await new this.model({
      ...createContractDto,
      isSourceCodeVerified: false,
      isFunctionVerified: false,
      isApproved: false,
      isCompiled: false,
      createdAt: new Date(),
    }).save();

    if (contract) {
      this.QueueQueue.add('compileContract', contract);
    }

    return contract;
  }

  async update(
    id: string,
    updateContractDto: UpdateContractDto,
    userId: string,
  ): Promise<Contract> {
    const contract = await this.findOne(id);
    if (contract.author !== userId)
      throw new BadRequestException(
        'This is not your contract, the action is not allowed',
      );

    //not to update approved contract body because it is in-use already
    if (contract.isApproved) {
      return await this.model
        .findByIdAndUpdate(id, {
          ...updateContractDto,
          contract: contract.contract,
        })
        .exec();
    }

    //user is not allowed to update some fields
    delete updateContractDto.isApproved;
    delete updateContractDto.isSourceCodeVerified;
    delete updateContractDto.isCompiled;
    delete updateContractDto.isFunctionVerified;

    //if contract body is changed, require re-compile, validate source code & functions
    if (
      updateContractDto.contract &&
      contract.contract !== updateContractDto.contract
    ) {
      this.QueueQueue.add('compileContract', contract);
      updateContractDto.isFunctionVerified = false;
      updateContractDto.isSourceCodeVerified = false;
      updateContractDto.isCompiled = false;
      updateContractDto.isApproved = false;
    }

    return await this.model
      .findByIdAndUpdate(id, updateContractDto, { new: true })
      .exec();
  }

  async approve(
    id: string,
    updateContractDto: UpdateContractDto,
  ): Promise<Contract> {
    return await this.model
      .findByIdAndUpdate(id, updateContractDto, { new: true })
      .exec();
  }

  async findByIdAndUpdate(id, updateContractDto: UpdateContractDto) {
    return await this.model.findByIdAndUpdate(id, updateContractDto).exec();
  }

  async delete(id: string, userId: string): Promise<Contract> {
    const contract = await this.findOne(id);
    if (contract.author !== userId)
      throw new BadRequestException(
        'This is not your contract, the action is not allowed',
      );
    if (contract.isApproved)
      throw new BadRequestException(
        'This contract is already in use, the action is not allowed',
      );
    return await this.model.findByIdAndDelete(id).exec();
  }

  
  //count for global app search
  async count(filter): Promise<any> {
    return await this.model.find(filter).count().exec();
  }

  async sumContracts(): Promise<any> {
    const result = await this.model.aggregate(sumContracts);
    if (result && result.length) {
      return result[0];
    }

    return {};
  }

  async sumContractAndTxByUser(userId: string): Promise<any> {
    const script = sumContractAndTxsByUser(userId);
    const result = await this.model.aggregate(script);
    if (result && result.length) {
      return result[0];
    }

    return {
      _id: 'sumContracts',
      plutusContracts: 0,
      aikenContracts: 0,
      marloweContracts: 0,
      isSourceCodeVerified: 0,
      isFunctionVerified: 0,
      isApproved: 0,
      hasTxContracts: 0,
      totalTxs: 0,
    };
  }

  async sumPublishedContractByMonth(): Promise<any> {
    const toDate = moment().toDate();
    const fromDate = moment().subtract(1, 'year').toDate();

    const months = [];
    for (let i = 0; i < 12; i++) {
      const month = moment().subtract(i, 'month').format('M-YYYY').toString();
      const shortYear = moment()
        .subtract(i, 'month')
        .format('MM-YY')
        .toString();
      const date = moment().subtract(i, 'month').toDate();
      months.push({ _id: month, shortYear, date });
    }
    const script = sumPublishedContractByMonth(fromDate, toDate);
    const _result = await this.model.aggregate(script);

    const emptyRecord = {
      _id: '',
      date: '',
      numberOfPublishedContracts: 0,
      numberOfCompiledContracts: 0,
      numberOfSourceCodeVerifiedContracts: 0,
      numberOfFunctionVerifiedContracts: 0,
      numberOfApprovedContracts: 0,
    };

    const result = months.map((item) => {
      const jobItem = _result.find((jobItem) => jobItem._id == item._id);
      if (jobItem) {
        return { ...jobItem, shortYear: item.shortYear };
      }

      return { ...emptyRecord, ...item };
    });

    return result.reverse();
  }
}

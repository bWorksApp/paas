import {
  MarloweSmartContract,
  PlutusSmartContract,
  AikenSmartContract,
} from '../../flatworks/types/types';

export class BaseContractDto {
  name: string;
  address: string;
  contract: MarloweSmartContract | PlutusSmartContract | AikenSmartContract;
  cborhex: string;
  code: string;
  description: string;
  isApproved: boolean;
  author: string;
  language: string;
  submittedUsers: number;
  version: string;
}

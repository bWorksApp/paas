import {
  MarloweSmartContract,
  PlutusSmartContract,
  AikenSmartContract,
} from '../../flatworks/types/types';

export class BaseContractDto {
  name: string;
  contract: MarloweSmartContract | PlutusSmartContract | AikenSmartContract;
  author: string;
  isSourceCodeVerified: boolean;
  isFunctionVerified: boolean;
  isApproved: boolean;
  version: string;
  description: string;
}

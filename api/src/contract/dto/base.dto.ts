import {
  MarloweSmartContract,
  PlutusSmartContract,
  AikenSmartContract,
  ContractType,
} from '../../flatworks/types/types';

export class BaseContractDto {
  name: string;
  contract: MarloweSmartContract | PlutusSmartContract | AikenSmartContract;
  compiledContract:
    | MarloweSmartContract
    | PlutusSmartContract
    | AikenSmartContract;
  author: string;
  gitRepo: string;
  ContractType: ContractType;
  isSourceCodeVerified: boolean;
  isFunctionVerified: boolean;
  isApproved: boolean;
  version: string;
  description: string;
}

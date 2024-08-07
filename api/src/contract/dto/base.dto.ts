import {
  MarloweSmartContract,
  PlutusSmartContract,
  AikenSmartContract,
  ContractType,
  ContractRepo,
} from '../../flatworks/types/types';

export class BaseContractDto {
  name: string;
  contract: MarloweSmartContract | PlutusSmartContract | AikenSmartContract;
  compiledContract:
    | MarloweSmartContract
    | PlutusSmartContract
    | AikenSmartContract;
  author: string;
  gitRepo: ContractRepo;
  contractType: ContractType;
  isCompiled: boolean;
  isSourceCodeVerified: boolean;
  isFunctionVerified: boolean;
  isApproved: boolean;
  version: string;
  description: string;
}

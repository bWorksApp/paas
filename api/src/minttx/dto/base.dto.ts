import { AssetMetadata, Asset } from '../../flatworks/types/types';

export class BaseMintDto {
  mintedByUserId: string;
  assetMetadata: AssetMetadata;
  asset: Asset;
  redeemer: any;
  mintTxHash: string;
  mintDate: Date;
  smartContractId: string;
  description: string;
}




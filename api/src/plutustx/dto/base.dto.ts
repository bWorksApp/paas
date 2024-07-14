export class BasePlutusTxDto {
  name: string;
  lockUserId: string;
  unlockUserId: string;
  receiverAddress: string;
  assetName: string;
  amount: number;
  lockedTxHash: string;
  unlockedTxHash: string;
  lockDate: Date;
  unlockDate: Date;
  lockMessage: string;
  unlockMessage: string;
  isUnlocked: boolean;
  unlockType: string;
  smartContractId: string;
  datumUnlockPublicKeyHash: string;
  datum: any;
  redeemer: any;
  scriptAddress: string;
  description: string;
}

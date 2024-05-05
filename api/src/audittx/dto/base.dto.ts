export class BaseAuditTxDto {
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
  isLockSuccess: boolean;
  isUnlockSuccess: boolean;
  smartContractId: string;
  datum: any;
  redeemer: any;
  contractAddress: string;
  description: string;
}

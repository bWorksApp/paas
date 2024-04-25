import { authType } from '../../flatworks/types/types';

export class UserWalletRegisterDto {
  username: string;
  fullName: string;
  isSmartContractDev: boolean;
  isdAppDev: boolean;
  authType: authType;
  walletRewardAddress: string;
  nonce: string;
}

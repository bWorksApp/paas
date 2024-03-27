import { authType } from './../../flatworks/types/types';
//use reward address for validate wallet signature

export class BaseUserDto {
  username: string;
  userId: string;
  email: string;
  contact: string;
  gitLink: string;
  isShowEmail: boolean;
  isShowContact: boolean;
  fullName: string;
  refreshToken: string;
  role: any[];
  isSmartContractDev: boolean;
  isdAppDev: boolean;
  authType: authType;
  isNotified: boolean;
  walletRewardAddress: string;
  nonce: string;
  password: string;
  isApproved: boolean;
  description: string;
}

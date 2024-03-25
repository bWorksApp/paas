import { authType } from './../../flatworks/types/types';

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
  skills: any[];
  isSmartContractDev: boolean;
  isdAppDev: boolean;
  authType: authType;
  isNotified: boolean;
  walletAddress: string;
  nonce: string;
  password: string;
  isApproved: boolean;
  description: string;
}

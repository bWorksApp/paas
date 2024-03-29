import { authType } from '../../flatworks/types/types';

export class RegisterUserDto {
  fullName: string;
  username: string;
  password: string;
  email: string;
  isSmartContractDev: boolean;
  isdAppDev: boolean;
  authType: authType;
  walletAddress: string;
}

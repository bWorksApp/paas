import { DApp } from '../../flatworks/types/types';
export class BaseAccessTokenDto {
  userId: string;
  token: string;
  expire: Date;
  description: string;
  dApps: DApp[];
}

/*
Type is  not extendable
Interface is  extendable
*/

export interface GitCommit {
  id: string;
  message: string;
  url: string;
  date: Date;
}

export interface FundTransaction {
  hash: string;
  amount: number;
  date: Date;
}

export interface RaList {
  count: number;
  data: any[];
}

export interface AddressUtxoType {
  tx_hash: string;
  block: string;
  amount: { unit: string; quantity: number }[];
}

export interface DashboardCardData {
  dAppTxs: {
    dAppTxs: number;
    totalAmount: number;
  };

  activeUsers: {
    contractDevs: number;
    dAppDevs: number;
  };
  publishedContracts: {
    publishedContracts: number;
    approvedContracts: number;
  };
  lockAndUnlockTxs: {
    lockTxs: number;
    unlockTxs: number;
  };
}

export type ProjectStatus = 'pending' | 'complete' | 'stopped';
export interface userJwtPayload {
  userId: string;
  username: string;
}

export interface MongooseQuery {
  filter: { [key: string]: any };
  sort: { [key: string]: any };
  select?: { [key: string]: number };
  skip: number;
  limit: number;
}

export interface CheckWalletType {
  amount: number;
  enough: boolean;
}
export interface GitLink {
  gitUrl: string;
}

export interface RequestUser {
  username: string;
  userId: string;
}

export interface Message {
  userId: string;
  body: string;
  createdAt: Date;
  id: string;
}
/*
 const event = {
      type: 'job' || 'payment' || 'message';
      userType: 'employer' || 'jobSeeker', -> to notify to employer or job seeker
      message: 'jobBidId' || 'plutusTxId',
    };
*/
export interface Event {
  type: string;
  userType?: string;
  message: string;
}

export interface TypeSkill {
  name: string;
}

export enum taskStatus {
  completed = 'completed',
  inProgress = 'inProgress',
  todo = 'todo',
}

export enum authType {
  email = 'email',
  wallet = 'wallet',
}

export enum Role {
  Admin = 'admin',
  User = 'user',
}

export type EventType = 'notification' | 'data' | 'progress' | 'error';

export const EventHeader = {
  'Content-Type': 'text/event-stream',
  Connection: 'keep-alive',
  'Cache-Control': 'no-cache',
  'X-Accel-Buffering': 'no',
  'Access-Control-Allow-Origin': '*',
};

/*
post origin compiled plutus script. 
the address field will be add by backend service.
the cborHox field is code field in frontend dApp
{
    "type": "PlutusScriptV2",
    "description": "",
    "cborHex": "4746010000222601"
}
*/
export interface PlutusSmartContract {
  address?: string;
  cborHex: string;
  type: string;
  description: string;
}

export interface AikenValidator {
  title: string;
  datum: any;
  redeemer: any;
  compiledCode: string;
  hash: string;
}

//aiken smart contract body
export interface AikenSmartContract {
  address?: string;
  plutusScript?: any;
  preamble: {
    version: string;
    plutusVersion: 'v1' | 'v2' | 'v3';
    compiler: {
      name: string;
      version: string;
    };
    [key: string]: any;
  };
  validators: AikenValidator[];
  definitions: any;
}

//marlowe smart contract body
export interface MarloweSmartContract {
  [key: string]: any;
}

export interface DApp {
  name: string;
}

//contract types
export enum ContractType {
  Plutus = 'plutus',
  Aiken = 'aiken',
  Marlowe = 'marlowe',
}

export interface ContractRepo {
  gitRepo: string;
  sourceCodeFolder: string;
  isForkedSourceCode?: boolean;
  forkedFrom?: string;
  buildCommand: string;
  outputJsonFile: string;
}

//mint asset metadata
export interface AssetMetadata {
  name: string;
  image: string;
  mediaType: string;
  description: string;
}

//mint asset type
export interface Asset {
  assetName: string;
  assetQuantity: number;
  metadata: string;
  label: string;
  recipient: string;
}
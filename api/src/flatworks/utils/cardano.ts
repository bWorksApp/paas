import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { AddressUtxoType } from '../types/types';
import { CheckWalletType } from '../types/types';
import { inspectAddress } from 'cardano-addresses';
import { KoiosProvider } from '@meshsdk/core';

const AddressUtxo = (
  address: string,
  httpService: HttpService,
): Promise<AddressUtxoType[]> => {
  const projectId = process.env.BLOCKFROST_PROJECT_ID;
  const blockfrostUrl = process.env.BLOCKFROST_URL;
  return httpService
    .get(`${blockfrostUrl}/addresses/${address}/utxos`, {
      headers: {
        project_id: projectId,
      },
    })
    .pipe(map((resp) => resp.data))
    .toPromise();
};

const TxsUtxo = (txHash: string, httpService: HttpService): Promise<any[]> => {
  const projectId = process.env.BLOCKFROST_PROJECT_ID;
  const blockfrostUrl = process.env.BLOCKFROST_URL;

  return httpService
    .get(`${blockfrostUrl}/txs/${txHash}/utxos`, {
      headers: {
        project_id: projectId,
      },
    })
    .pipe(map((resp) => resp.data))
    .toPromise();
};

const CheckWallet = (
  address: string,
  amount: number,
  httpService: HttpService,
): Promise<CheckWalletType> => {
  const projectId = process.env.BLOCKFROST_PROJECT_ID;
  const blockfrostUrl = process.env.BLOCKFROST_URL;
  const result = { amount: 0, isEnough: false };

  return httpService
    .get(`${blockfrostUrl}/addresses/${address}`, {
      headers: {
        project_id: projectId,
      },
    })
    .pipe(map((resp) => resp.data))
    .toPromise()
    .then((data) => {
      result.amount =
        data.amount.map((item) => (item.unit == 'lovelace' ? item : null))[0]
          .quantity / 1000000;
      result.isEnough = result.amount >= amount;
      return result;
    })
    .catch((err) => err);
};

const CreateWallet = (userId: string) => {};

//validate if a string is a cardano address
const validateAddress = async (address: string) => {
  let isAddress = false;
  try {
    isAddress = !!(await inspectAddress(address));
  } catch (err) {
    console.log('validate address: not validate Cardano address');
  }

  return isAddress;
};

const fetchUtxo = async (scriptAddress, asset, lockedTxHash) => {
  const isMainnet = process.env.IS_MAINNET === 'true';
  const cardanoNetwork = isMainnet ? 'api' : 'preprod';
  try {
    const koios = new KoiosProvider(cardanoNetwork);
    const utxos = await koios.fetchAddressUTxOs(scriptAddress, asset);
    const utxo = utxos.find((item) => item.input.txHash === lockedTxHash);
    return utxo;
  } catch (e) {
    return null;
  }
};

export {
  AddressUtxo,
  TxsUtxo,
  CheckWallet,
  CreateWallet,
  validateAddress,
  fetchUtxo,
};

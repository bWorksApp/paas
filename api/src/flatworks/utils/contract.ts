import { resolvePlutusScriptAddress } from '@meshsdk/core';
import type { PlutusScript } from '@meshsdk/core';
import { PlutusSmartContract, AikenSmartContract } from '../types/types';
import cbor from 'cbor';
import { validateAddress } from './cardano';

/*convert origin plutus script to format uses by third party libraries
from 
{
  address?: string;
  cborHex: string;
  type: string;
  description: string;
}
to 
{
  code: 'string,
  version: 'V1' | "V2",
};
*/

const formatPlutusScript = (
  plutusSmartContract: PlutusSmartContract,
): PlutusScript => {
  return {
    code: plutusSmartContract.cborHex || null,
    version:
      plutusSmartContract.type === 'PlutusScriptV1'
        ? 'V1'
        : plutusSmartContract.type === 'PlutusScriptV2'
        ? 'V2'
        : null,
  };
};

const createPlutusScriptAddress = async (script: PlutusScript) => {
  let address;
  try {
    address = resolvePlutusScriptAddress(script, 0);
  } catch (e) {
    console.log('invalid plutus format');
    return null;
  }
  const isAddress = await validateAddress(address);
  if (address && isAddress) return address;
  return null;
};

const createAikenScriptAddress = async (
  aikenSmartContract: AikenSmartContract,
) => {
  let address = null;
  try {
    const script: PlutusScript = {
      code: cbor
        .encode(
          Buffer.from(aikenSmartContract.validators[0].compiledCode, 'hex'),
        )
        .toString('hex'),
      version:
        aikenSmartContract.preamble.plutusVersion === 'v1'
          ? 'V1'
          : aikenSmartContract.preamble.plutusVersion === 'v2'
          ? 'V2'
          : null,
    };
    address = resolvePlutusScriptAddress(script, 0);
  } catch (e) {
    console.log('aiken object has invalid plutus format');
    return null;
  }
  const isAddress = await validateAddress(address);
  if (address && isAddress) return address;
  return null;
};

export {
  createPlutusScriptAddress,
  createAikenScriptAddress,
  formatPlutusScript,
};

import { checkSignature, generateNonce } from '@meshsdk/core';

async function getNonce() {
  const nonceString = process.env.NONCE_STRING;
  return generateNonce(nonceString);
}

async function validateSignature(nonce, userAddress, signature) {
  let isValidated = false;
  console.log(nonce, userAddress, signature);
  try {
    isValidated = await checkSignature(nonce, userAddress, signature);
  } catch (err) {
    console.log(err);
    return false;
  }

  return isValidated;
}

export { getNonce, validateSignature };

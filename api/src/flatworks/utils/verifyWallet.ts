import { checkSignature, generateNonce } from '@meshsdk/core';

async function getNonce() {
  const nonceString = process.env.NONCE_STRING;
  return generateNonce(nonceString);
}

async function verifySignature(userAddress, signature, nonce) {
  return checkSignature(nonce, userAddress, signature);
}

export { getNonce, verifySignature };

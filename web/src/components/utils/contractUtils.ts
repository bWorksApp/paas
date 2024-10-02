import {
  PlutusScript,
  resolvePlutusScriptAddress,
  Transaction,
  KoiosProvider,
  resolveDataHash,
  resolvePaymentKeyHash,
  Data,
} from "@meshsdk/core";

//const cbor = require("cbor-web");

//format aiken plutus.json to PlutusScript
/* 
const formatAikenContract = (plutusScript): PlutusScript => {
  return {
    code: cbor
      .encode(Buffer.from(plutusScript.validators[0].compiledCode, "hex"))
      .toString("hex"),
    version: plutusScript.preamble?.plutusVersion === "v1" ? "V1" : "V2",
  };
}; */

/*
get contract address: networkId = 1 for mainnet, 0 for testnet
*/
const parseContractAddress = (script, networkId) => {
  let scriptAddress = "";
  try {
    scriptAddress = resolvePlutusScriptAddress(script, networkId);
  } catch (error) {}
  return scriptAddress;
};

/*
convert origin compiled contract to PlutusScript format
 */
const formatContract = (contract): PlutusScript => {
  return {
    code: contract.cborHex,
    version: contract.type === "PlutusScriptV1" ? "V1" : "V2",
  };
};

/*
origin compiled contract =  {
            "type": "PlutusScriptV1",
            "description": "",
            "cborHex": "49480100002221200101"
        },

script: PlutusScript = {
  code: "5908945908910100003233223232323233223232323232323232323232323232232223232533532323235003233355301e12001323212330012233350052200200200100235001220011233001225335002101d100101a2333573466e3c00800406c068c8d4004888888888888010d400888008cd5ce24812353637269707420636f6e74657874206465636f646564207375636365737366756c6c79003333573466e1cd55cea80224000466442466002006004646464646464646464646464646666ae68cdc39aab9d500c480008cccccccccccc88888888888848cccccccccccc00403403002c02802402001c01801401000c008cd4060064d5d0a80619a80c00c9aba1500b33501801a35742a014666aa038eb9406cd5d0a804999aa80e3ae501b35742a01066a0300426ae85401cccd54070089d69aba150063232323333573466e1cd55cea801240004664424660020060046464646666ae68cdc39aab9d5002480008cc8848cc00400c008cd40b1d69aba15002302d357426ae8940088c98c80c4cd5ce01901881789aab9e5001137540026ae854008c8c8c8cccd5cd19b8735573aa004900011991091980080180119a8163ad35742a004605a6ae84d5d1280111931901899ab9c03203102f135573ca00226ea8004d5d09aba2500223263202d33573805c05a05626aae7940044dd50009aba1500533501875c6ae854010ccd540700788004d5d0a801999aa80e3ae200135742a00460406ae84d5d1280111931901499ab9c02a029027135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d55cf280089baa00135742a00860206ae84d5d1280211931900d99ab9c01c01b01933573892011d52656465656d6572206465636f646564207375636365737366756c6c79003333573466e1cd55ce9baa005480008480048c98c8068cd5ce00d80d00c19ab9c4911944617461206465636f646564207375636365737366756c6c79003333573466e1cd55cea802a40004642460020046eb8d5d09aab9e500623263201933573803403202e2030264c6403066ae7124010350543500018135573ca00226ea80044dd50008919118011bac001320013550172233335573e0024a032466a03060086ae84008c00cd5d100100a119191999ab9a3370e6aae7540092000233221233001003002300a35742a004600a6ae84d5d1280111931900a19ab9c015014012135573ca00226ea80048c8c8c8c8cccd5cd19b8735573aa00890001199991110919998008028020018011919191999ab9a3370e6aae7540092000233221233001003002301335742a00466a01a0246ae84d5d1280111931900c99ab9c01a019017135573ca00226ea8004d5d0a802199aa8043ae500735742a0066464646666ae68cdc3a800a4008464244460040086ae84d55cf280191999ab9a3370ea0049001119091118008021bae357426aae7940108cccd5cd19b875003480008488800c8c98c806ccd5ce00e00d80c80c00b89aab9d5001137540026ae854008cd4025d71aba135744a004464c6402a66ae7005805404c4d5d1280089aba25001135573ca00226ea80044cd54005d73ad112232230023756002640026aa02844646666aae7c0089405c8cd4058cc8848cc00400c008c018d55cea80118029aab9e500230043574400602426ae84004488c8c8cccd5cd19b875001480008c8488c00800cc014d5d09aab9e500323333573466e1d40092002212200123263201233573802602402001e26aae7540044dd5000919191999ab9a3370ea002900311909111180200298039aba135573ca00646666ae68cdc3a8012400846424444600400a60126ae84d55cf280211999ab9a3370ea006900111909111180080298039aba135573ca00a46666ae68cdc3a8022400046424444600600a6eb8d5d09aab9e500623263201233573802602402001e01c01a26aae7540044dd5000919191999ab9a3370e6aae7540092000233221233001003002300535742a0046eb4d5d09aba2500223263200e33573801e01c01826aae7940044dd50009191999ab9a3370e6aae75400520002375c6ae84d55cf280111931900619ab9c00d00c00a13754002464646464646666ae68cdc3a800a401842444444400646666ae68cdc3a8012401442444444400846666ae68cdc3a801a40104664424444444660020120106eb8d5d0a8029bad357426ae8940148cccd5cd19b875004480188cc8848888888cc008024020dd71aba15007375c6ae84d5d1280391999ab9a3370ea00a900211991091111111980300480418061aba15009375c6ae84d5d1280491999ab9a3370ea00c900111909111111180380418069aba135573ca01646666ae68cdc3a803a400046424444444600a010601c6ae84d55cf280611931900a99ab9c01601501301201101000f00e00d135573aa00826aae79400c4d55cf280109aab9e5001137540024646464646666ae68cdc3a800a4004466644424466600200a0080066eb4d5d0a8021bad35742a0066eb4d5d09aba2500323333573466e1d4009200023212230020033008357426aae7940188c98c8038cd5ce00780700600589aab9d5003135744a00226aae7940044dd5000919191999ab9a3370ea002900111909118008019bae357426aae79400c8cccd5cd19b875002480008c8488c00800cdd71aba135573ca008464c6401666ae7003002c0240204d55cea80089baa00112232323333573466e1d400520042122200123333573466e1d40092002232122230030043006357426aae7940108cccd5cd19b87500348000848880088c98c8030cd5ce00680600500480409aab9d5001137540024646666ae68cdc3a800a4004400a46666ae68cdc3a80124000400a464c6401066ae700240200180144d55ce9baa0011220021220014984800524103505431003200135500322112225335001135003220012213335005220023004002333553007120010050040011122002122122330010040031123230010012233003300200200101",
  version: "V2",
};

*/

export { parseContractAddress, formatContract };
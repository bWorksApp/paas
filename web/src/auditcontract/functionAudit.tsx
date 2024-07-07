import React from "react";
import SmartContractAudit from "../components/contractLockUnlock";
import { SelectChangeEvent } from "@mui/material/Select";
import { useGetList } from "react-admin";
import Box from "@mui/material/Box";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import moment from "moment";
import { Transaction, Data, KoiosProvider } from "@meshsdk/core";
import {
  parseContractAddress,
  formatContract,
  formatAikenContract,
} from "./utils";
import { useCreate, useDataProvider, useUpdate } from "react-admin";

const SmartContracts = () => {
  const isMainnet = process.env.REACT_APP_IS_MAINNET;
  const cardanoNetwork = isMainnet ? "api" : "preprod";
  const dataProvider = useDataProvider();

  const [create, { isLoading, error }] = useCreate();
  const [update, { isLoading: _isLoading, error: _error }] = useUpdate();

  const [datum, setDatum] = React.useState([]);
  const handleChangeDatum = (data) => {
    setDatum(
      data.items.map((item) =>
        item.dataType === "date" ? moment(item.value).unix() : item.value
      )
    );
  };

  const [redeemer, setRedeemer] = React.useState([]);
  const handleChangeRedeemer = (data) => {
    setRedeemer(
      data.items.map((item) =>
        item.dataType === "date" ? moment(item.value).unix() : item.value
      )
    );
  };

  const [lockedTxHash, setLockedTxHash] = React.useState("");
  const handleChangeLockedTxHash = (event) => {
    setLockedTxHash(event.target.value);
  };

  const [auditName, setAuditName] = React.useState("");
  const handleChangeAuditName = (event) => {
    setAuditName(event.target.value);
  };

  const { wallet, connected, connecting } = useWallet();

  React.useEffect(() => {
    setNotification({
      ...notification,
      message:
        wallet && connected
          ? null
          : "No connected wallet, please connect a wallet first",
    });
  }, [connected, wallet]);

  const initContract = {
    selected: "",
    contracts: [],
  };
  const [contract, setContract] = React.useState(initContract);

  const [notification, setNotification] = React.useState({
    error: false,
    message: "",
  });

  const contracts = useGetList("contracts", {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "createdAt", order: "DESC" },
  });

  console.log(contract);
  React.useEffect(() => {
    if (!contracts.isLoading && !contracts.error) {
      const selected = contracts.data[0].id;
      setContract({ selected, contracts: contracts.data });
    }
  }, [contracts.data]);

  const [amountToLock, setAmountToLock] = React.useState(0);

  const [receiveAddress, setReiveAddress] = React.useState("");

  const handleReceiveAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setReiveAddress(event.target.value);
  };

  const handleContractChange = (event: SelectChangeEvent) => {
    setContract({ ...contract, selected: event.target.value });
  };

  const [scriptAddress, setScriptAddress] = React.useState("");
  const [plutusScript, setPlutusScript] = React.useState({
    code: "",
    version: "",
  });

  React.useEffect(() => {
    const selectedContract = contract.contracts.find(
      (item) => item.id === contract.selected
    );
    if (selectedContract?.contractType === "plutus") {
      const _selectedContract = formatContract(selectedContract.contract);
      const scriptAddress = parseContractAddress(
        _selectedContract,
        isMainnet ? 1 : 0
      );
      setScriptAddress(scriptAddress);
      setPlutusScript(formatContract(selectedContract.contract));
    }
    if (selectedContract?.contractType === "aiken") {
      const _selectedContract = formatAikenContract(selectedContract.contract);
      const scriptAddress = parseContractAddress(
        _selectedContract,
        isMainnet ? 1 : 0
      );
      setScriptAddress(scriptAddress);
      setPlutusScript(formatAikenContract(selectedContract.contract));
    }
  }, [contract]);

  const handleChangeLockAda = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmountToLock(parseInt(event.target.value));
  };

  const lockFunction = async () => {
    //get PlutusScript & its address

    const validateMessage = !scriptAddress
      ? "No smart contract address, please select a smart contract"
      : !wallet || !connected
      ? "No connected wallet, please connect wallet first"
      : null;

    if (!scriptAddress || !wallet || !connected) {
      setNotification({ ...notification, message: validateMessage });
      return;
    }

    const d: Data = {
      alternative: 0,
      fields: datum,
    };

    const amountToLockLoveLace = (amountToLock * 1000000).toString();

    if (wallet && connected && amountToLock) {
      const tx = new Transaction({ initiator: wallet });
      tx.sendLovelace(
        {
          address: scriptAddress,
          datum: {
            value: d,
            inline: true,
          },
        },
        amountToLockLoveLace
      );

      let txHash = "";

      try {
        const unsignedTx = await tx.build();
        const signedTx = await wallet.signTx(unsignedTx);
        txHash = await wallet.submitTx(signedTx);
      } catch (e) {
        setNotification({
          ...notification,
          message: "Transaction is failed",
        });
        create("audittxs", {
          data: {
            name: auditName,
            amount: amountToLock,
            smartContractId: contract.selected,
            scriptAddress: scriptAddress,
            assetName: "Ada",
            isLockSuccess: false,
            datum: datum,
          },
        });
        return;
      }

      setNotification({
        ...notification,
        message: txHash ? `Transaction is submmited: ${txHash}` : null,
      });
      create("audittxs", {
        data: {
          name: auditName,
          amount: amountToLock,
          smartContractId: contract.selected,
          scriptAddress: scriptAddress,
          assetName: "Ada",
          isLockSuccess: true,
          lockedTxHash: txHash,
          datum: datum,
        },
      });
      console.log("txHash", txHash, new Date());
    }
  };

  const [utxo, setUtxo] = React.useState(null);

  React.useEffect(() => {
    async function getUtxo() {
      dataProvider
        .customMethod(
          "public/findutxo",
          { filter: { scriptAddress, asset: "lovelace", lockedTxHash } },
          "GET"
        )
        .then((result) => setUtxo(result.data))
        .catch((error) => console.error(error));
    }

    if (scriptAddress && lockedTxHash) getUtxo();
  }, [scriptAddress, lockedTxHash]);

  console.log(utxo);

  const unlockFunction = async () => {
    /*   async function _getAssetUtxo({ scriptAddress, asset, lockedTxHash }) {
      const koios = new KoiosProvider(cardanoNetwork);
      const utxos = await koios.fetchAddressUTxOs(scriptAddress, asset);

      let utxo = utxos.find((item) => item.input.txHash === lockedTxHash);
      return utxo;
    }

    const utxo = await _getAssetUtxo({
      scriptAddress: scriptAddress,
      asset: "lovelace",
      lockedTxHash: lockedTxHash,
    });
 */
    const r = { data: { alternative: 0, fields: redeemer } };

    //const redeemer = { data: { alternative: 0, fields: ["Hello, World!"] } };

    console.log(r);
    const address = await wallet.getChangeAddress();
    const collateralUtxos = await wallet.getCollateral();

    if (!utxo || !receiveAddress || !address) {
      setNotification({
        ...notification,
        message: !utxo
          ? "UTXO is not found"
          : !receiveAddress
          ? "No receiver address"
          : !address
          ? "No signer address"
          : null,
      });
      return;
    }

    /*
    const tx = new Transaction({ initiator: wallet })
      .redeemValue({
        value: assetUtxo,
        script: script,
        datum: assetUtxo,
        redeemer: redeemer,
      })
      .sendValue(address, assetUtxo)
      .setRequiredSigners([address]);

    const unsignedTx = await tx.build();
    const signedTx = await wallet.signTx(unsignedTx, true);
    const txHash = await wallet.submitTx(signedTx);
    */

    // create the unlock asset transaction
    let txHash;
    try {
      const tx = new Transaction({ initiator: wallet })
        .redeemValue({
          value: utxo,
          script: plutusScript,
          datum: utxo,
          redeemer: r,
        })
        .sendValue(address, utxo) // address is recipient address
        .setCollateral(collateralUtxos) //this is option, we either set or not set still works
        .setRequiredSigners([address]);

      const unsignedTx = await tx.build();
      // note that the partial sign is set to true
      const signedTx = await wallet.signTx(unsignedTx, true);
      txHash = await wallet.submitTx(signedTx);
    } catch (err) {
      console.log(err);
      setNotification({ ...notification, message: "Submit error" });
      update("audittxs/unlock", {
        id: lockedTxHash,
        data: { isUnlockSuccess: false, redeemer: redeemer },
      });
      return;
    }

    setNotification({
      ...notification,
      message: `Transaction is submitted, TxHash: ${txHash}`,
    });
    update("audittxs/unlock", {
      id: lockedTxHash,
      data: {
        isUnlockSuccess: true,
        unlockedTxHash: txHash,
        redeemer: redeemer,
      },
    });
    console.log("unlockTxHash", txHash);
  };

  return (
    <Box sx={{ mt: 0, display: "flex", flex: 1, flexDirection: "column" }}>
      <Box sx={{ mt: 0, display: "flex", flex: 1, flexDirection: "row" }}>
        <SmartContractAudit
          auditName={auditName}
          handleChangeAuditName={handleChangeAuditName}
          scriptAddress={scriptAddress}
          datum={datum}
          redeemer={redeemer}
          lockedTxHash={lockedTxHash}
          handleChangeLockedTxHash={handleChangeLockedTxHash}
          handleChangeDatum={handleChangeDatum}
          handleChangeRedeemer={handleChangeRedeemer}
          handleContractChange={handleContractChange}
          handleChangeLockAda={handleChangeLockAda}
          handleReceiveAddressChange={handleReceiveAddressChange}
          contract={contract}
          lockFunction={lockFunction}
          unlockFunction={unlockFunction}
          amountToLock={amountToLock}
          receiveAddress={receiveAddress}
          notification={notification}
        ></SmartContractAudit>
        <CardanoWallet />
      </Box>
    </Box>
  );
};

export default SmartContracts;

/*

import { CardanoWallet, useWallet } from "@meshsdk/react";
import { useState } from "react";

import {
  Transaction,
  Data,
  BlockfrostProvider,
  resolveDataHash,
  KoiosProvider,
  resolvePaymentKeyHash,
} from "@meshsdk/core";
import { MeshProvider } from "@meshsdk/react";

import { resolvePlutusScriptAddress, checkSignature } from "@meshsdk/core";
import type { PlutusScript } from "@meshsdk/core";
import Avatar from "./avatar";
import { script, scriptAddr } from "./contract";


const MeshJs = () => {
  console.log(script, scriptAddr);
  //lock fund
  const { wallet, connected, connecting } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);

  async function lock() {
    const hash = resolvePaymentKeyHash((await wallet.getUsedAddresses())[0]);
    const datum: Data = {
      alternative: 0,
      fields: [hash],
    };

    const tx = new Transaction({ initiator: wallet }).sendLovelace(
      {
        address: scriptAddr,
        datum: {
          value: datum,
          inline: true,
        },
      },
      "2000000"
    );

    const unsignedTx = await tx.build();
    const signedTx = await wallet.signTx(unsignedTx);
    const txHash = await wallet.submitTx(signedTx);
    console.log("txHash", txHash);
  }

  async function _getAssetUtxo() {
    const address = (await wallet.getUsedAddresses())[0];
    const hash = resolvePaymentKeyHash(address);
    const datum: Data = {
      alternative: 0,
      fields: [hash],
    };
    const koios = new KoiosProvider("api");
    const utxos = await koios.fetchAddressUTxOs(scriptAddr, "lovelace");

    const dataHash = resolveDataHash(datum);

    let utxo = utxos.find((utxo: any) => {
      return utxo.output.dataHash == dataHash;
    });
    console.log(utxo);
    return utxo;
  }

  async function unLock() {
    const address = (await wallet.getUsedAddresses())[0];
    const hash = resolvePaymentKeyHash(address);
    const datum: Data = {
      alternative: 0,
      fields: [hash],
    };

    const assetUtxo = await _getAssetUtxo();

    const redeemer = { data: { alternative: 0, fields: ["Hello, World!"] } };
    console.log(123, assetUtxo, wallet, script, datum, redeemer);
    // create the unlock asset transaction
    const tx = new Transaction({ initiator: wallet })
      .redeemValue({
        value: assetUtxo,
        script: script,
        datum: assetUtxo,
        redeemer: redeemer,
      })
      .sendValue(address, assetUtxo)
      .setRequiredSigners([address]);

    const unsignedTx = await tx.build();
    const signedTx = await wallet.signTx(unsignedTx, true);
    const txHash = await wallet.submitTx(signedTx);
    console.log(txHash);
  }

  return (
    <div>
      <h1>Connect Wallet</h1>

      <CardanoWallet />
      {connected && (
        <>
          <div>{JSON.stringify(script)}</div>
          <div>{JSON.stringify(scriptAddr)}</div>
          <h1>Lock funds in your Contract</h1>

          <button
            type="button"
            onClick={() => lock()}
            disabled={connecting || loading}
            style={{
              margin: "8px",
              backgroundColor: connecting || loading ? "orange" : "grey",
            }}
          >
            Lock funds
          </button>
          <h1>Unlock your funds from your Contract</h1>

          <button
            type="button"
            onClick={() => unLock()}
            disabled={connecting || loading}
            style={{
              margin: "8px",
              backgroundColor: connecting || loading ? "orange" : "grey",
            }}
          >
            Unlock funds
          </button>

          <button
            type="button"
            onClick={() => _getAssetUtxo()}
            disabled={connecting || loading}
            style={{
              margin: "8px",
              backgroundColor: connecting || loading ? "orange" : "grey",
            }}
          >
            get utxos
          </button>
        </>
      )}
    </div>
  );
};

export default MeshJs;


*/

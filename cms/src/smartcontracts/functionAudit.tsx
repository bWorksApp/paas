import React from "react";
import SmartContractJob from "../components/contractLockUnlock";
import { SelectChangeEvent } from "@mui/material/Select";
import { useGetList } from "react-admin";
import Box from "@mui/material/Box";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import moment from "moment";
import { Transaction, Data, KoiosProvider } from "@meshsdk/core";
import { parseContractAddress, formatContract } from "./utils";

const SmartContracts = () => {
  const isMainnet = process.env.REACT_APP_IS_MAINNET;
  const cardanoNetwork = isMainnet ? "api" : "preprod";

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

    console.log("lock value", d, scriptAddress, amountToLock);

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
        return;
      }

      setNotification({
        ...notification,
        message: txHash ? `Transaction is submmited: ${txHash}` : null,
      });

      console.log("txHash", txHash, new Date());
    }
  };

  const unlockFunction = async () => {
    async function _getAssetUtxo({ scriptAddress, asset, lockedTxHash }) {
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

    const address = await wallet.getChangeAddress();

    const collateralUtxos = await wallet.getCollateral();

    console.log(utxo, address, collateralUtxos);

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

    console.log(
      "unlock values",
      cardanoNetwork,
      plutusScript,
      scriptAddress,
      receiveAddress,
      address,
      utxo
    );

    // create the unlock asset transaction
    let txHash;
    try {
      const tx = new Transaction({ initiator: wallet })
        .redeemValue({
          value: utxo,
          script: plutusScript,
          datum: utxo,
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

      return;
    }

    setNotification({
      ...notification,
      message: `Transaction is submitted, TxHash: ${txHash}`,
    });

    console.log("unlockTxHash", txHash);
  };

  const [datum, setDatum] = React.useState([]);
  const handleChangeDatum = (data) => {
    setDatum(
      data.items.map((item) =>
        item.dataType === "date" ? moment(item.value).unix() : item.value
      )
    );
  };

  const [redeemer, setRedeemer] = React.useState("");
  const handleChangeRedeemer = (data) => {
    setRedeemer(
      data.items.map((item) =>
        item.dataType === "date" ? moment(item.value).unix() : item.value
      )
    );
  };

  const [lockedTxHash, setCockedTxHash] = React.useState("");
  const handleChangeLockedTxHash = (event) => {
    setCockedTxHash(event.target.value);
  };

  return (
    <Box sx={{ mt: 0, display: "flex", flex: 1, flexDirection: "column" }}>
      <Box sx={{ mt: 0, display: "flex", flex: 1, flexDirection: "row" }}>
        <SmartContractJob
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
        ></SmartContractJob>
        <CardanoWallet />
      </Box>
    </Box>
  );
};

export default SmartContracts;

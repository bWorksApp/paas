import React from "react";
import SmartContractJob from "../components/smartContractJobMeshJs";
import { SelectChangeEvent } from "@mui/material/Select";
import { useGetList } from "react-admin";
import dayjs, { Dayjs } from "dayjs";
import Box from "@mui/material/Box";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import { script, scriptAddr } from "./contract";
import moment from "moment";
import Typography from "@mui/material/Typography";
import {
  Transaction,
  Data,
  BlockfrostProvider,
  resolveDataHash,
  KoiosProvider,
} from "@meshsdk/core";
import { useCreate, useDataProvider, useUpdate } from "react-admin";
import queryString from "query-string";
import { useSearchParams } from "react-router-dom";

const SmartContracts = () => {
  //get current userId
  const dataProvider = useDataProvider();
  const [userId, setUserId] = React.useState(null);
  dataProvider
    .customMethod("customapis/userid", { filter: {} }, "GET")
    .then((result) => setUserId(result.data))
    .catch((error) => console.error(error));

  const isMainnet = process.env.NEXT_PUBLIC_IS_MAINNET;
  const cardanoNetwork = isMainnet ? "api" : "preprod";
  const [update, { isLoading: _isLoading, error: _error }] = useUpdate();

  const [searchParams] = useSearchParams();
  const search = searchParams.get("jobbidid");
  const jobBidId = JSON.parse(search);
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

  //lock datum
  const currentDate = dayjs();
  const [datum, setDatum] = React.useState({
    publicKeyHash: "no datum",
    deadline: currentDate,
  });

  const initContract = {
    selected: "",
    contracts: [],
  };
  const [contract, setContract] = React.useState(initContract);

  const initUnlockUsers = {
    selected: "",
    unlockUsers: [],
  };
  const [unlockUsers, setUnlockUsers] = React.useState(initUnlockUsers);

  const users = useGetList("users", {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: "createdDate", order: "DESC" },
  });
/* 
  React.useEffect(() => {
    if (!users.isLoading && !users.error && users.data.length > 0) {
      //select cms user as default.
      const selected = users.data.find((item) => item.username === "cms").id;
      setUnlockUsers({ selected, unlockUsers: users.data });
    }
  }, [users.data]); */

  const [unlockPartner, setUnlockPartner] = React.useState("");

  const [notification, setNotification] = React.useState({
    error: false,
    message: "",
  });

  const contracts = useGetList("contracts", {
    pagination: { page: 1, perPage: 10 },
    sort: { field: "createdDate", order: "DESC" },
  });

  const initPlutusTxs = {
    selected: "0",
    plutusTxs: [],
  };

  const [plutusTxs, setPlutusTxs] = React.useState(initPlutusTxs);

  const plutusTxsList = useGetList("plutustxs", {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "createdAt", order: "DESC" },
    filter: {
      unlockedTxHash: { $exists: false },
      //not null, empty or not exist
      lockedTxHash: { $nin: [null, "", undefined] },
    },
  });

  React.useEffect(() => {
    if (
      !plutusTxsList.isLoading &&
      !plutusTxsList.error &&
      plutusTxsList.data.length > 0
    ) {
      const selected = plutusTxsList.data[0].id;
      setPlutusTxs({ selected, plutusTxs: plutusTxsList.data });
    }
  }, [plutusTxsList.data]);

  //admin pkh
  const [adminPKH, setAdminPKH] = React.useState("");
  const adminWallets = useGetList("adminwallets", {
    filter: { isMainnet: isMainnet },
    pagination: { page: 1, perPage: 10 },
    sort: { field: "createdDate", order: "DESC" },
  });

  React.useEffect(() => {
    if (
      !adminWallets.isLoading &&
      !adminWallets.error &&
      adminWallets.data.length > 0
    ) {
      const pKeyHash = adminWallets.data[0].pKeyHash;
      setAdminPKH(pKeyHash);
      setDatum({ ...datum, publicKeyHash: pKeyHash });
    }
  }, [adminWallets.data]);

  //user pkh
  const [userPKH, setUserPKH] = React.useState("");

  const userWallets = useGetList("wallets", {
    pagination: { page: 1, perPage: 1000 },
  });

  React.useEffect(() => {
    if (!contracts.isLoading && !contracts.error) {
      const selected = contracts.data[0].id;
      setContract({ selected, contracts: contracts.data });
    }
  }, [contracts.data]);

  const [amountToLock, setAmountToLock] = React.useState(0);

  const [redeemAdaValues, setRedeemAdaValues] = React.useState({
    amountToRedeem: 0,
    datumToRedeem: "",
    transactionIdLocked: "",
    lockedTxHash: "",
    transactionIndxLocked: 0,
    manualFee: "NA",
  });
  //refund flag to pay to job seeker if true, refund to employer if false
  const [receiveAddress, setReiveAddress] = React.useState("");

  const handleReceiveAddressChange = (e) => {
    setReiveAddress(e.target.value);
  };

  React.useEffect(() => {
    const plutusTx = plutusTxs.plutusTxs.find(
      (tx) => tx.id === plutusTxs.selected
    );

    if (!plutusTx) return;

    setRedeemAdaValues({
      ...redeemAdaValues,
      amountToRedeem: plutusTx.amount || 0,
      lockedTxHash: plutusTx.lockedTxHash || "",
    });
  }, [plutusTxs]);

  console.log(redeemAdaValues);

  const handleContractChange = (event: SelectChangeEvent) => {
    setContract({ ...contract, selected: event.target.value });
  };

  const handleUnlockUserChange = (event: SelectChangeEvent) => {
    setUnlockUsers({ ...unlockUsers, selected: event.target.value });
  };

  const handlePlutusTxChange = (event: SelectChangeEvent) => {
    setPlutusTxs({ ...plutusTxs, selected: event.target.value });
  };

  const handleChangeUnlockPartner = (event: SelectChangeEvent) => {
    setUnlockPartner(event.target.value);
    const publicKeyHash =
      event.target.value === "bworks"
        ? adminPKH
        : event.target.value === "other"
        ? userPKH
        : "";
    setDatum({ ...datum, publicKeyHash: publicKeyHash });
    if (event.target.value === "bworks") {
      setUnlockUsers({
        ...unlockUsers,
        selected: users.data.find((user) => user.username === "cms").id,
      });
    }
  };

  const handleChangeLockAda = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmountToLock(parseInt(event.target.value));
  };

  const handleChangePublicKeyHash = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDatum({ ...datum, publicKeyHash: event.target.value });
  };

  const handleChangeDate = (newValue: any | null) => {
    //validate datum: deadline must be minimum 1 week
    if (newValue.diff(currentDate, "day") < 7) {
      setNotification({ error: true, message: "Minimum deadline is 01 week" });
      return;
    } else {
      setNotification({ error: false, message: "" });
    }
    setDatum({ ...datum, deadline: newValue });
  };

  //redeem data
  const handleChangRedeemAda =
    (prop) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setRedeemAdaValues({ ...redeemAdaValues, [prop]: event.target.value });
    };

  const [create, { isLoading, error }] = useCreate();

  const sendAdaToPlutus = async () => {
    //public keyhash must be a valid bworks wallet address if unlock transaction will be signed by bworks.
    const scriptAddr = contract.contracts.find(
      (item) => item.id === contract.selected
    ).address;

    const validateMessage = !scriptAddr
      ? "No smart contract address, please select a smart contract"
      : !datum.publicKeyHash
      ? "No datum public key hash, please select a unlock user with wallet"
      : !wallet || !connected
      ? "No connected wallet, please connect wallet first"
      : null;

    if (!scriptAddr || !datum.publicKeyHash || !wallet || !connected) {
      setNotification({ ...notification, message: validateMessage });
      return;
    }

    const d: Data = {
      alternative: 0,
      fields: [datum.publicKeyHash, 10],
    };
    const amountToLockLoveLace = (amountToLock * 1000000).toString();
    if (wallet && connected && amountToLock && datum.publicKeyHash) {
      const tx = new Transaction({ initiator: wallet });

      tx.sendLovelace(
        {
          address: scriptAddr,
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
        create("plutustxs", {
          data: {
            name: txName,
            assetName: "Ada",
            unlockUserId: unlockUsers.selected,
            amount: amountToLock,
            lockDate: new Date(),
            datumUnlockPublicKeyHash: datum.publicKeyHash,
            scriptAddress: scriptAddr,
            lockMessage: `lock plutus transaction signed by ${localStorage.getItem(
              "username"
            )} failed`,
          },
        });
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
      create("plutustxs", {
        data: {
          name: txName,
          assetName: "Ada",
          amount: amountToLock,
          lockedTxHash: txHash,
          datumUnlockPublicKeyHash: datum.publicKeyHash,
          scriptAddress: scriptAddr,
          lockDate: new Date(),
          lockMessage: `lock plutus transaction submitted by ${localStorage.getItem(
            "username"
          )}`,
        },
      });

      console.log("txHash", txHash, new Date());
    }
  };

  const redeemAdaFromPlutus = async () => {
    async function _getAssetUtxo({ scriptAddress, asset, lockedTxHash }) {
      const koios = new KoiosProvider(cardanoNetwork);
      const utxos = await koios.fetchAddressUTxOs(scriptAddr, asset);

      let utxo = utxos.find((item) => item.input.txHash === lockedTxHash);

      return utxo;
    }

    const currentContract = contract.contracts.find(
      (item) => item.id === contract.selected
    );

    const scriptAddr = currentContract.address;

    const lockedPlutusTx = plutusTxs.plutusTxs.find(
      (item) => item.id === plutusTxs.selected
    );


    const utxo = await _getAssetUtxo({
      scriptAddress: scriptAddr,
      asset: "lovelace",
      lockedTxHash: lockedPlutusTx.lockedTxHash,
    });

    const address = await wallet.getChangeAddress();

    const collateralUtxos = await wallet.getCollateral();
    console.log(cardanoNetwork, currentContract, address, utxo, collateralUtxos);

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
    // create the unlock asset transaction
    let txHash;
    try {
      const tx = new Transaction({ initiator: wallet })
        .redeemValue({
          value: utxo,
          script: {
            code: currentContract.code,
            version: currentContract.version,
          },
          datum: utxo,
        })
        .sendValue(receiveAddress, utxo) // address is recipient address
        .setCollateral(collateralUtxos) //this is option, we either set or not set still works
        .setRequiredSigners([address]);

      const unsignedTx = await tx.build();
      // note that the partial sign is set to true
      const signedTx = await wallet.signTx(unsignedTx, true);
      txHash = await wallet.submitTx(signedTx);
    } catch (err) {
      console.log(err)
      setNotification({ ...notification, message: "Submit error" });
      update("plutustxs", {
        id: lockedPlutusTx.id,
        data: {
          unlockMessage: `unlock by ${localStorage.getItem(
            "username"
          )} is failed`,
          unlockDate: new Date(),
          unlockUserId: userId,
        },
        previousData: lockedPlutusTx,
      });
      return;
    }
    update("plutustxs", {
      id: lockedPlutusTx.id,
      data: {
        unlockMessage: `unlock by ${localStorage.getItem(
          "username"
        )} is succeed`,
        unlockDate: new Date(),
        unlockUserId: userId,
        unlockedTxHash: txHash,
      },
      previousData: lockedPlutusTx,
    });

    setNotification({
      ...notification,
      message: `Transaction is submitted, TxHash: ${txHash}`,
    });

    console.log("unlockTxHash", txHash);
  };

  const [txName, setTxName] = React.useState("");
  const handleChangeTxName = (e) => {
    setTxName(e.target.value);
  };
  return (
    <Box sx={{ mt: 0, display: "flex", flex: 1, flexDirection: "column" }}>
      <Box sx={{ mt: 0, display: "flex", flex: 1, flexDirection: "row" }}>
        <SmartContractJob
          txName={txName}
          handleChangeTxName={handleChangeTxName}
          handleContractChange={handleContractChange}
          handlePlutusTxChange={handlePlutusTxChange}
          handleChangeLockAda={handleChangeLockAda}
          handleChangRedeemAda={handleChangRedeemAda}
          handleChangeUnlockPartner={handleChangeUnlockPartner}
          handleChangePublicKeyHash={handleChangePublicKeyHash}
          handleUnlockUserChange={handleUnlockUserChange}
          handleReceiveAddressChange={handleReceiveAddressChange}
          contract={contract}
          plutusTxs={plutusTxs}
          unlockUsers={unlockUsers}
          sendAdaToPlutus={sendAdaToPlutus}
          redeemAdaFromPlutus={redeemAdaFromPlutus}
          amountToLock={amountToLock}
          datum={datum}
          unlockPartner={unlockPartner}
          handleChangeDate={handleChangeDate}
          redeemAdaValues={redeemAdaValues}
          receiveAddress={receiveAddress}
          notification={notification}
        ></SmartContractJob>
        <CardanoWallet />
      </Box>
    </Box>
  );
};

export default SmartContracts;

import React from "react";
import SmartContractAudit from "../components/contractMint";
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
} from "../utils/contractUtils";
import { useCreate, useDataProvider, useUpdate } from "react-admin";

const SmartContracts = () => {
  const isMainnet = process.env.NEXT_PUBLIC_IS_MAINNET;
  const cardanoNetwork = isMainnet ? "api" : "preprod";
  const dataProvider = useDataProvider();

  const [create, { isLoading, error }] = useCreate();

  const [redeemer, setRedeemer] = React.useState([]);
  const handleChangeRedeemer = (data) => {
    setRedeemer(
      data.items.map((item) =>
        item.dataType === "date" ? moment(item.value).unix() * 1000 : item.value
      )
    );
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

  React.useEffect(() => {
    if (!contracts.isLoading && !contracts.error) {
      const selected = contracts.data[0].id;
      setContract({ selected, contracts: contracts.data });
    }
  }, [contracts.data]);

  const [receiveAddress, setReiveAddress] = React.useState("");

  const [assetMetadata, setAssetMetadata] = React.useState({
    name: "",
    image: "",
    mediaType: "image/jpg",
    description: "",
  });

  const handleChangeAssetMetadata = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAssetMetadata({
      ...assetMetadata,
      [event.target.id]: event.target.value,
    });
  };

  const [asset, setAsset] = React.useState({
    assetName: "",
    assetQuantity: 1,
    label: 1,
    recipient: "",
  });

  const handleChangeAsset = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAsset({
      ...asset,
      [event.target.id]: event.target.value,
    });
  };
  const [description, setDescription] = React.useState("");
  const handleChangeDescription = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
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
      const scriptAddress = parseContractAddress(
        selectedContract.contract.plutusScript,
        isMainnet ? 1 : 0
      );
      setScriptAddress(scriptAddress);
      setPlutusScript(selectedContract.contract.plutusScript);
    }
  }, [contract]);

  const mintFunction = async () => {
    console.log(assetMetadata, asset);

    const address = await wallet.getChangeAddress();
    const collateralUtxos = await wallet.getCollateral();

    if (!asset.recipient || !address) {
      setNotification({
        ...notification,
        message: !asset.recipient
          ? "No receiver address"
          : !address
          ? "No signer address"
          : null,
      });
      return;
    }

    const r = {
      data: { alternative: 0, fields: redeemer },
      tag: "MINT",
    };

    // create the mint asset transaction
    let txHash;
    try {
      const tx = new Transaction({ initiator: wallet });
      tx.mintAsset(
        plutusScript,
        {
          ...asset,
          assetQuantity: asset.assetQuantity.toString(),
          label: asset.label.toString(),
          metadata: assetMetadata,
        },
        r
      );
      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
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
    create("mintassets", {
      data: {
        assetMetadata: assetMetadata,
        asset: asset,
        smartContractId: contract.selected,
        redeemer: redeemer,
        mintTxHash: txHash,
        description: description,
      },
    });
    console.log("mintTxHash", txHash);
  };

  return (
    <Box sx={{ mt: 0, display: "flex", flex: 1, flexDirection: "column" }}>
      <Box sx={{ mt: 0, display: "flex", flex: 1, flexDirection: "row" }}>
        <SmartContractAudit
          scriptAddress={scriptAddress}
          redeemer={redeemer}
          handleChangeRedeemer={handleChangeRedeemer}
          contract={contract}
          handleContractChange={handleContractChange}
          assetMetadata={assetMetadata}
          handleChangeAssetMetadata={handleChangeAssetMetadata}
          asset={asset}
          handleChangeAsset={handleChangeAsset}
          mintFunction={mintFunction}
          notification={notification}
          description={description}
          handleChangeDescription={handleChangeDescription}
        ></SmartContractAudit>
        <Box sx={{ p: 1 }}>
          <CardanoWallet />
        </Box>
      </Box>
    </Box>
  );
};

export default SmartContracts;

import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DateField,
  RichTextField,
  ReferenceField,
  useRecordContext,
  useUpdate,
  useRefresh,
  Labeled,
  NumberField,
  BooleanField,
  TextInput,
  BooleanInput,
  ReferenceInput,
  AutocompleteInput,
  FunctionField,
  UrlField,
} from "react-admin";
import Button from "@mui/material/Button";
import LinkResoureField from "../components/linkResourceField";
import ShowJob from "../components/showButton";
import Link from "@mui/material/Link";

const ListScreen = () => {
  const isMainnet = process.env.REACT_APP_IS_MAINNET;

  const explorerUrl = isMainnet
    ? process.env.REACT_APP_CARDANO_EXPLORER_MAINNET_URL
    : process.env.REACT_APP_CARDANO_EXPLORER_PREPROD_URL;

  const filters = [
    <TextInput
      label="Search"
      source="textSearch"
      alwaysOn
      sx={{ width: 300 }}
    />,
  ];

  return (
    <List
      perPage={25}
      sort={{ field: "date", order: "desc" }}
      resource="mintassets"
      hasCreate={false}
      filters={filters}
    >
      <Datagrid bulkActionButtons={false}>
        <TextField source="asset.assetName" />
        <TextField source="asset.assetQuantity" />
        <FunctionField
          label="Mint TxHash"
          render={(record) =>
            record.mintTxHash ? (
              <>
                {record.mintTxHash && (
                  <Link
                    href={`${explorerUrl}${record.mintTxHash}`}
                    target="_blank"
                  >
                    View Tx
                  </Link>
                )}
              </>
            ) : (
              <p>Transaction submission failed</p>
            )
          }
        />
        <ReferenceField source="mintedByUserId" reference="users" label="Minted by">
          <TextField source="fullName" />
        </ReferenceField>
        <ReferenceField source="smartContractId" reference="contracts" label="Smart contract">
          <TextField source="name" />
        </ReferenceField>
        <FunctionField
          label="Redeemer"
          render={(record) => (
            <div
              dangerouslySetInnerHTML={{ __html: JSON.stringify(record.redeemer) }}
            />
          )}
        />
        <DateField source="mintDate" label="Minted at" showTime />
        <ShowJob customLabel="Detail" label="View detail" />
      </Datagrid>
    </List>
  );
};

export default ListScreen;

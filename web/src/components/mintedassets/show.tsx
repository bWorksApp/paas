import * as React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  RichTextField,
  ReferenceField,
  NumberField,
  ReferenceArrayField,
  ArrayField,
  SingleFieldList,
  ChipField,
  TopToolbar,
  useRecordContext,
  FunctionField,
  BooleanField,
} from "react-admin";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import BackButton from "../components/backButton";
import { JsonField, JsonInput } from "react-admin-json-view";

const ShowActions = () => (
  <TopToolbar>
    {/* Add your custom action components */}
    <BackButton />
  </TopToolbar>
);

const ShowTitle = () => {
  // the record can be empty while loading
  const record = useRecordContext();
  if (!record) return null;
  return <span>{record.asset.assetName}</span>;
};

const ShowScreen = (props) => {
  return (
    <Show {...props} title={<ShowTitle />} actions={<ShowActions />}>
      <SimpleShowLayout>
        <Grid container spacing={1}>
          <Grid item xs={12} md={12} lg={12} xl={12}>
            <FunctionField
              render={(record) => {
                return (
                  <>
                    <Typography variant="h5" gutterBottom display="inline">
                      {record.asset.assetName}{" "}
                    </Typography>
                    <i>
                      <DateField source="createdAt" fullWidth showTime /> by{" "}
                      <ReferenceField
                        record={record}
                        source="mintedByUserId"
                        reference="users"
                        link={false}
                      >
                        <TextField source="fullName" />{" "}
                      </ReferenceField>
                    </i>
                  </>
                );
              }}
            />
          </Grid>
          <Grid item md={12} />

          <Grid item xs={12} md={4} lg={3} xl={2}>
            <Typography variant="subtitle2">
              <strong>Smart contract</strong>
            </Typography>
            <Typography variant="subtitle2">
              <ReferenceField
                source="smartContractId"
                reference="contracts"
                link={false}
              >
                <TextField source="name" />{" "}
              </ReferenceField>
            </Typography>
            <TextField source="contractType" />
          </Grid>

          <Grid item md={12} />
          <Grid item xs={12} md={4} lg={6} xl={3}>
            <Typography variant="subtitle2">
              <strong> Mint TxHash</strong>
            </Typography>
            <TextField source="mintTxHash" fullWidth />
          </Grid>

          <Grid item md={12} />

          <Grid item xs={12} md={12} lg={12} xl={12}>
            <Typography variant="subtitle2">
              <strong>Description</strong>
            </Typography>
            <RichTextField source="description" fullWidth />
          </Grid>
          <Grid item xs={12} md={12} lg={12} xl={12}>
            <Typography variant="subtitle2">
              <strong>Asset</strong>
            </Typography>
            <JsonField
              source="asset"
              label="Asset"
              fullWidth
              jsonString={false}
              reactJsonOptions={{
                name: null,
                collapsed: true,
                enableClipboard: false,
                displayDataTypes: false,
              }}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12} xl={12}>
            <Typography variant="subtitle2">
              <strong>Asset metadata</strong>
            </Typography>
            <JsonField
              source="assetMetadata"
              label="Asset metadata"
              fullWidth
              jsonString={false}
              reactJsonOptions={{
                name: null,
                collapsed: true,
                enableClipboard: false,
                displayDataTypes: false,
              }}
            />
          </Grid>
        </Grid>
      </SimpleShowLayout>
    </Show>
  );
};

export default ShowScreen;

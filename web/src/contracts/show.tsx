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
import CurrencyNumberField from "../components/currencyNumberField";
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
  return <span>{record.name}</span>;
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
                      {record.name}{" "}
                    </Typography>
                    <i>
                      <DateField source="createdAt" fullWidth showTime /> by{" "}
                      <ReferenceField
                        record={record}
                        source="author"
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
              <strong>Contract Type</strong>
            </Typography>
            <CurrencyNumberField source="contractType" />
          </Grid>

          <Grid item md={12} />
          <Grid item xs={12} md={4} lg={6} xl={3}>
            <Typography variant="subtitle2">
              <strong> Git repo</strong>
            </Typography>
            <TextField source="gitRepo.gitRepo" fullWidth />
          </Grid>
          <FunctionField
            render={(record) => {
              if (!record.gitRepo?.isForkedSourceCode) return null;
              return (
                <Grid item xs={12} md={4} lg={6} xl={4}>
                  <Typography variant="subtitle2">
                    <strong>Forked from </strong>
                  </Typography>
                  <TextField source="gitRepo.forkedFrom" fullWidth />
                </Grid>
              );
            }}
          />

          <Grid item md={12} />

          <Grid item xs={12} md={4} lg={3} xl={1.5}>
            <Typography variant="subtitle2">
              <strong> Is Compiled</strong>
            </Typography>
            <BooleanField source="isCompiled" fullWidth />
          </Grid>
          <Grid item xs={12} md={4} lg={3} xl={1.5}>
            <Typography variant="subtitle2">
              <strong>Is source code validated</strong>
            </Typography>
            <BooleanField source="isSourceCodeVerified" fullWidth />
          </Grid>

          <Grid item xs={12} md={4} lg={3} xl={2}>
            <Typography variant="subtitle2">
              <strong>Is function validated</strong>
            </Typography>
            <BooleanField source="isFunctionVerified" fullWidth />
          </Grid>
          <Grid item xs={12} md={4} lg={3} xl={2}>
            <Typography variant="subtitle2">
              <strong> Is approved </strong>
            </Typography>
            <BooleanField source="isApproved" fullWidth />
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
              <strong>Published contract json value</strong>
            </Typography>
            <JsonField
              source="contract"
              label="Contract json value"
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
              <strong>Compiled contract json value</strong>
            </Typography>
            <JsonField
              source="compiledContract"
              label="Compiled contract"
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

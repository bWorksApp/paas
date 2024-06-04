import * as React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  ArrayInput,
  SimpleFormIterator,
} from "react-admin";
import Grid from "@mui/material/Grid";
import { RichTextInput } from "ra-input-rich-text";

const CreateScreen = () => {
  return (
    <Create redirect="list">
      <SimpleForm>
        <Grid container spacing={1}>
          <Grid item xs={12} md={12} lg={8} xl={6}>
            <ArrayInput source="dApps" label="Use for dApps">
              <SimpleFormIterator inline>
                <TextInput source="name" helperText={false} label="dApp name" />
              </SimpleFormIterator>
            </ArrayInput>
          </Grid>

          <Grid item md={12} />

          <Grid item xs={12} md={12} lg={8} xl={6}>
            <RichTextInput source="description" fullWidth label="Notes" />
          </Grid>
        </Grid>
      </SimpleForm>
    </Create>
  );
};
export default CreateScreen;

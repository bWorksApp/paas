import * as React from "react";
import {
  SimpleForm,
  TextInput,
  SelectInput,
  NumberInput,
  DateTimeInput,
  Edit,
  ReferenceInput,
  BooleanInput
} from "react-admin";

import Grid from "@mui/material/Grid";
import { RichTextInput } from "ra-input-rich-text";




const EditScreen = () => (
  <Edit>
     <SimpleForm>
      <Grid container spacing={1}>
        <Grid item xs={12} md={8} lg={6} xl={4}>
          <TextInput source="name" fullWidth required />
        </Grid>
        <Grid item md={12} />
        <Grid item xs={12} md={12} lg={8} xl={6}>
          <ReferenceInput
            source="jobBidId"
            reference="jobbids"
           
          >
            <SelectInput optionText={"name"} />
          </ReferenceInput>
        </Grid>
        <Grid item md={12} />
        <Grid item xs={12} md={8} lg={6} xl={4}>
          <TextInput source="assetName" fullWidth  />
        </Grid>
        <Grid item xs={12} md={8} lg={6} xl={4}>
          <NumberInput source="amount" fullWidth  />
        </Grid>
        <Grid item md={12} />
        <Grid item xs={12} md={8} lg={6} xl={4}>
          <TextInput source="lockedTxHash" fullWidth  />
        </Grid>
        <Grid item xs={12} md={8} lg={6} xl={4}>
          <DateTimeInput source="lockDate" fullWidth  />
        </Grid>
        <Grid item md={12} />
        <Grid item xs={12} md={8} lg={6} xl={4}>
          <TextInput source="unlockedTxHash" fullWidth  />
        </Grid>
        <Grid item xs={12} md={8} lg={6} xl={4}>
          <DateTimeInput source="unlockDate" fullWidth  />
        </Grid>
        <Grid item md={12} />

        <Grid item xs={12} md={8} lg={6} xl={4}>
          <BooleanInput source="isUnlocked" />
        </Grid>
       
        <Grid item md={12} />
        <Grid item xs={12} md={12} lg={8} xl={6}>
          <RichTextInput source="description" fullWidth />
        </Grid>
      </Grid>
    </SimpleForm>
  </Edit>
);

export default EditScreen;

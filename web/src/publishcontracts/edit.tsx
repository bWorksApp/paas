import * as React from "react";
import { Edit, SimpleForm, TextInput, SelectInput, regex } from "react-admin";
import Grid from "@mui/material/Grid";
import { RichTextInput } from "ra-input-rich-text";
import Box from "@mui/material/Box";
import BackButton from "../components/backButton";
import { TopToolbar } from "react-admin";

const Actions = () => (
  <TopToolbar>
    <BackButton />
  </TopToolbar>
);

const validateGithubUrl = regex(
  /^https:\/\/github\.com(?:\/[^\s\/]+){2}$/,
  "Must be a github https url"
);

const jsonValidation = (value, allValues) => {
  try {
    JSON.parse(value);
  } catch (e) {
    return "Must be a json format";
  }
  return undefined;
};

const validateJson = [jsonValidation];

const EditScreen = () => (
  <Edit redirect="list" actions={<Actions />}>
    <SimpleForm>
      <Grid container spacing={1}>
        <Grid item xs={12} md={8} lg={8} xl={4}>
          <TextInput source="name" fullWidth required />
        </Grid>
        <Grid item md={12} />
        <Grid item xs={12} md={4} lg={4} xl={2}>
          <SelectInput
            fullWidth
            required
            source="contractType"
            choices={[
              { id: "plutus", name: "Plutus" },
              { id: "aiken", name: "Aiken" },
              { id: "marlowe", name: "Marlowe" },
            ]}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={4} xl={2}>
          <TextInput
            source="version"
            fullWidth
            label="Contract version"
            required
          />
        </Grid>

        <Grid item md={12} />
        <Grid item xs={12} md={8} lg={8} xl={5}>
          <TextInput
            source="contract"
            fullWidth
            required
            multiline={true}
            label="Contract json value"
            validate={validateJson}
          />
        </Grid>
        <Grid item md={12} />

        <Grid item xs={12} md={8} lg={8} xl={5}>
          <Box component="section" sx={{ p: 1, border: "1px dashed grey" }}>
            Contract source code
            <TextInput
              source="gitRepo.gitLink"
              fullWidth
              required
              validate={validateGithubUrl}
            />
            <TextInput
              source="gitRepo.sourceCodeFolder"
              fullWidth
              required
              label="Contract code folder"
            />
            <TextInput source="buildCommand" fullWidth required />
            <TextInput
              source="gitRepo.outputJsonFile"
              fullWidth
              required
              label="Build output file name"
            />
          </Box>
        </Grid>
        <Grid item md={12} />

        <Grid item xs={12} md={8} lg={8} xl={5}>
          <RichTextInput
            source="description"
            fullWidth
            label="Validator description *"
          />
        </Grid>
      </Grid>
    </SimpleForm>
  </Edit>
);
export default EditScreen;

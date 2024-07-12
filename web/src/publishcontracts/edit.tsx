import * as React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  regex,
  BooleanInput,
  ToolbarProps,
  SaveButton,
  Toolbar,
} from "react-admin";
import Grid from "@mui/material/Grid";
import { RichTextInput } from "ra-input-rich-text";
import Box from "@mui/material/Box";
import BackButton from "../components/backButton";
import { TopToolbar } from "react-admin";
import { useWatch } from "react-hook-form";

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
  if (typeof value === "object") return undefined;
  let jsonValue;
  try {
    jsonValue = JSON.parse(value);
  } catch (e) {
    return "Must be a json format";
  }
  if (typeof jsonValue !== "object") return "Must be a json format";
  return undefined;
};

const validateJson = [jsonValidation];

const ForkedRepo = () => {
  const isForkedSourceCode = useWatch({ name: "gitRepo.isForkedSourceCode" });
  if (!isForkedSourceCode) return null;
  return <TextInput source="gitRepo.forkedFrom" fullWidth />;
};
const EditScreen = () => (
  <Edit redirect="list" actions={<Actions />}>
    <SimpleForm>
      <Grid container spacing={0}>
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
            sx={{ ml: 1 }}
          />
        </Grid>

        <Grid item md={12} />
        <Grid item xs={12} md={8} lg={8} xl={5}>
          <TextInput
            source="contract"
            fullWidth
            required
            multiline={true}
            label="Contract compiled json value"
            validate={validateJson}
            format={(v) => {
              if (typeof v === "object") return JSON.stringify(v);
            }}
          />
        </Grid>
        <Grid item md={12} sx={{ m: 0, p: 0 }} />

        <Grid item xs={12} md={8} lg={8} xl={5}>
          <Box component="section" sx={{ p: 1, border: "1px dashed grey" }}>
            Contract source code
            <TextInput
              source="gitRepo.gitLink"
              fullWidth
              required
              validate={validateGithubUrl}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
              }}
            >
              <BooleanInput
                source="gitRepo.isForkedSourceCode"
                label="Forked from other"
                defaultValue={false}
                fullWidth
              />
              <ForkedRepo />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
              }}
            >
              <TextInput
                source="gitRepo.sourceCodeFolder"
                fullWidth
                required
                label="Contract code folder"
                defaultValue="."
                sx={{ mr: 1 }}
              />
              <TextInput source="gitRepo.buildCommand" fullWidth required />
            </Box>
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

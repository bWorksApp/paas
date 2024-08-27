import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import {
  Form,
  TextInput,
  SaveButton,
  DateTimeInput,
  ArrayInput,
  NumberInput,
  SimpleFormIterator,
  SelectInput,
  FormDataConsumer,
} from "react-admin";

export default function SmartContract(props) {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleSmartContractChange = props.handleContractChange;
  const selectedContract = props.contract?.selected || null;
  const contracts = props.contract?.contracts || [];
  const mintFunction = props.mintFunction || null;
  const handleChangeRedeemer = props.handleChangeRedeemer || null;
  const assetMetadata = props.assetMetadata || {};
  const handleChangeAssetMetadata = props.handleChangeAssetMetadata || null;
  const asset = props.asset || {};
  const handleChangeAsset = props.handleChangeAsset || null;

  const description = props.description || "";
  const handleChangeDescription = props.handleChangeDescription || null;

  if (!contracts || contracts.length === 0) {
    return (
      <Typography variant="subtitle1" gutterBottom>
        No smart contract
      </Typography>
    );
  }

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ bborderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="wallet actions">
            <Tab
              value="2"
              label="Mint asset tokens by Smart contract"
              sx={{ padding: 0, marginLeft: 0 }}
            />
          </TabList>
        </Box>

        <TabPanel value="1" sx={{ padding: 0 }}>
          <Box
            sx={{
              paddingTop: 0,
              paddingLeft: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                marginLeft: 0,
                paddingTop: 0,
                paddingLeft: 0,
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
              }}
            >
              <FormControl
                variant="standard"
                sx={{ minWidth: 120, marginRight: 1 }}
              >
                <InputLabel id="simple-select-standard-label">
                  Select a smart contract
                </InputLabel>
                <Select
                  sx={{ width: 240 }}
                  labelId="simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={selectedContract}
                  onChange={handleSmartContractChange}
                  label="contract"
                >
                  {contracts.map((item) => (
                    <MenuItem value={item.id}>{item.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{
                marginLeft: 0,
                paddingTop: 0,
                paddingLeft: 0,
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
              }}
            >
              <Box
                sx={{
                  paddingTop: 0,
                  paddingLeft: 0,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="subtitle2" sx={{ mt: 3 }}>
                  Asset metadata
                </Typography>
                <TextField
                  sx={{ width: 480, fontSize: "small" }}
                  id="name"
                  label="Name"
                  value={assetMetadata.name}
                  onChange={handleChangeAssetMetadata}
                  variant="standard"
                />

                <TextField
                  sx={{ width: 480 }}
                  id="image"
                  label="Image"
                  variant="standard"
                  value={assetMetadata.image}
                  onChange={handleChangeAssetMetadata}
                />
                <TextField
                  sx={{ width: 480, fontSize: "small" }}
                  id="mediaType"
                  label="Media type"
                  value={assetMetadata.mediaType}
                  onChange={handleChangeAssetMetadata}
                  variant="standard"
                />

                <TextField
                  sx={{ width: 480 }}
                  id="description"
                  label="Description"
                  variant="standard"
                  value={assetMetadata.description}
                  onChange={handleChangeAssetMetadata}
                />
              </Box>

              <Box
                sx={{
                  paddingTop: 0,
                  paddingLeft: 5,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="subtitle2" sx={{ mt: 3 }}>
                  Asset
                </Typography>

                <TextField
                  sx={{ width: 480, fontSize: "small" }}
                  id="assetName"
                  label="Asset Name"
                  value={asset.assetName}
                  onChange={handleChangeAsset}
                  variant="standard"
                />

                <TextField
                  sx={{ width: 480 }}
                  id="assetQuantity"
                  label="Asset Quantity"
                  variant="standard"
                  type="number"
                  value={asset.assetQuantity}
                  onChange={handleChangeAsset}
                />

                <TextField
                  sx={{ width: 480, fontSize: "small" }}
                  id="label"
                  label="Label"
                  value={asset.label}
                  onChange={handleChangeAsset}
                  variant="standard"
                  type="number"
                />

                <TextField
                  sx={{ width: 480 }}
                  id="recipient"
                  label="Receive wallet address"
                  variant="standard"
                  value={asset.recipient}
                  onChange={handleChangeAsset}
                />
              </Box>
            </Box>

            <TextField
              sx={{ width: 1000 }}
              id="description"
              label="Description"
              variant="standard"
              multiline
              value={description}
              onChange={handleChangeDescription}
            />
            <Form onSubmit={handleChangeRedeemer}>
              <Box sx={{ width: 650 }}>
                <ArrayInput source="items" label="Redeemer">
                  <SimpleFormIterator inline>
                    <SelectInput
                      source="dataType"
                      label="Data type"
                      choices={[
                        { id: "number", name: "Number" },
                        { id: "string", name: "String" },
                        { id: "date", name: "Date" },
                      ]}
                    />

                    <FormDataConsumer>
                      {({ formData, scopedFormData, getSource, ...rest }) =>
                        scopedFormData &&
                        scopedFormData.dataType === "number" ? (
                          <NumberInput
                            source={getSource("value")}
                            helperText={false}
                            sx={{ width: 400 }}
                            {...rest}
                          />
                        ) : scopedFormData &&
                          scopedFormData.dataType === "date" ? (
                          <DateTimeInput
                            source={getSource("value")}
                            helperText={false}
                            sx={{ width: 400 }}
                            {...rest}
                          />
                        ) : (
                          <TextInput
                            source={getSource("value")}
                            helperText={false}
                            sx={{ width: 400 }}
                            {...rest}
                          />
                        )
                      }
                    </FormDataConsumer>
                  </SimpleFormIterator>
                </ArrayInput>
                <SaveButton label="build redeemer" icon={<></>} />
                <p>Redeemer value: {JSON.stringify(props.redeemer)}</p>
                <p>Contract address: {JSON.stringify(props.scriptAddress)}</p>
              </Box>
            </Form>
            <Button
              variant="text"
              sx={{ width: 20, marginTop: 3 }}
              onClick={mintFunction}
            >
              Submit
            </Button>
          </Box>
        </TabPanel>
      </TabContext>

      <Typography
        variant="subtitle1"
        sx={{
          ml: 0,
          color: "green",
          ...(props.notification?.error === true && { color: "red" }),
        }}
      >
        {props.notification?.message}
      </Typography>

      <Divider textAlign="left" sx={{ width: 500, mt: 2 }}></Divider>
      <Typography
        variant="subtitle1"
        sx={{
          ml: 0,
          color: "#e65100",
        }}
      >
        Important notes
      </Typography>
      {value === "1" ? (
        <Typography
          variant="caption"
          sx={{
            ml: 0,
            color: "#ed6c02",
            width: 500,
            wordWrap: "break-word",
          }}
        >
          Before submit the payment transaction please ensure: <br />
          1. You are using Nami wallet. <br />
          2. Image is proper ipfs url. <br />
        </Typography>
      ) : (
        <Typography
          variant="caption"
          sx={{
            ml: 0,
            color: "#ed6c02",
          }}
        >
          Please verify with receiver its wallet address before submit the
          unlock transaction.
        </Typography>
      )}
    </Box>
  );
}

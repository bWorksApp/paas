import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useDataProvider } from "react-admin";

const FormPropsTextFields = () => {
  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          id="password"
          label="New password"
          type="password"
          autoComplete="current-password"
        />
        <TextField
          id="repeatPassword"
          label="Repeat password"
          type="password"
          autoComplete="current-password"
        />
        <Button sx={{ borderRadius: 0 }} size="small" color="primary">
          <Box p={0} m={2} sx={{ color: "primary.main" }}>
            Update
          </Box>
        </Button>
        <Typography
          variant="caption"
          display="block"
          gutterBottom
          sx={{ p: 1 }}
        ></Typography>
      </div>
    </Box>
  );
};

export default FormPropsTextFields;

import * as React from "react";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useMediaQuery, Theme } from "@mui/material";
import RegisterEmail from "./registerEmail";
import RegisterWallet from "./registerWallet";

export default function Register() {
  const isXSmall = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const padding = isXSmall ? 15 : 0;
  const [checked, setChecked] = React.useState(true);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(!checked);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        mt: 20,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          pl: padding,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                defaultChecked
                onChange={handleChange}
                id="wallet"
              />
            }
            label="Register with wallet"
          />
          <FormControlLabel
            control={
              <Checkbox checked={!checked} onChange={handleChange} id="email" />
            }
            label="Register with email"
          />
        </Box>
        {!checked && <RegisterEmail />}
        {checked && <RegisterWallet />}
      </Box>
    </Box>
  );
}

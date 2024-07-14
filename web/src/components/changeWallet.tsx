import * as React from "react";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import FormLabel from "@mui/material/FormLabel";
import { useForm } from "react-hook-form";
import ButtonBase from "@mui/material/ButtonBase";
import { useDataProvider, useNotify } from "react-admin";
import { Link } from "react-router-dom";
import { useMediaQuery, Theme } from "@mui/material";
import { CardanoWallet, useWallet } from "@meshsdk/react";

export default function Register() {
  const { wallet, connected, connecting } = useWallet();

  const [walletAddress, setWalletAddress] = React.useState("");
  const [walletRewardAddress, setWalletRewardAddress] = React.useState("");

  React.useEffect(() => {
    async function getWalletAddress() {
      const changeAddress = connected ? await wallet.getChangeAddress() : "";
      const walletRewardAddress = connected
        ? await wallet.getRewardAddresses()
        : [""];
      setWalletAddress(changeAddress);
      setWalletRewardAddress(walletRewardAddress[0]);
    }
    getWalletAddress();
  }, [connected, wallet]);

  const isXSmall = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const dataProvider = useDataProvider();
  const notify = useNotify();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  console.log(errors);

  const onSubmit = (data) => {
    console.log(data);
    dataProvider
      .customMethod(
        "users/changewallet",
        {
          data: {
            walletAddress: walletAddress,
            walletRewardAddress: walletRewardAddress,
          },
        },
        "POST"
      )
      .then((result) => {
        notify("Submit successfully, please use new wallet to connect PAAS", {
          type: "success",
        });
      })
      .catch((error) => {
        notify(error.message, { type: "warning" });
      });
  };

  const padding = isXSmall ? 15 : 0;
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "left",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            //for mobile
            pl: padding,
          }}
        >
          <FormControl sx={{ m: 1, width: 460 }} variant="standard">
            <InputLabel>Wallet address *</InputLabel>
            <Input type="text" value={walletAddress} disabled />
          </FormControl>
          <FormControl sx={{ m: 1, width: 460 }} variant="standard">
            <InputLabel>Wallet stake address *</InputLabel>
            <Input type="text" disabled value={walletRewardAddress} />
          </FormControl>

          <Button variant="outlined" type="submit">
            UPDATE
          </Button>
          <Typography
            variant="caption"
            display="block"
            sx={{ m: 1, width: 460, color: "#ff9800" }}
          >
            {!connected && "No connected wallet"}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            height: 100,
          }}
        >
          <CardanoWallet label="Select wallet" />
        </Box>
      </Box>
    </form>
  );
}

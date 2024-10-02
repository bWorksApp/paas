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
        "auth/registerwalelt",
        {
          data: {
            ...data,
            authType: "wallet",
            walletAddress: walletAddress,
            walletRewardAddress: walletRewardAddress,
          },
        },
        "POST"
      )
      .then((result) => {
        notify(
          "Submit successfully, please use registered wallet to connect PAAS",
          { type: "success" }
        );
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
          justifyContent: "center",
          alignItems: "center",
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
          <ButtonBase
            sx={{
              mr: 2,
              alignSelf: "flex-end",
              color: "#c62828",
              mt: 0,
              mb: 2,
            }}
            onClick={() => reset()}
          >
            Clear
          </ButtonBase>
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            <FormControl sx={{ m: 1, width: 220 }} variant="standard">
              <InputLabel>Username *</InputLabel>
              <Input
                {...register("username", {
                  required: true,
                  maxLength: {
                    value: 20,
                    message: "Username should lesser than 20 words",
                  },

                  validate: (value) => {
                    const regex = /\s/g;
                    return (
                      !regex.test(value) ||
                      "Username must not contain a whitespace or new line"
                    );
                  },
                })}
              />
            </FormControl>
          </Box>
          <FormControl sx={{ m: 1, width: 460 }} variant="standard">
            <InputLabel>Full name *</InputLabel>
            <Input
              type="text"
              {...register("fullName", {
                required: true,
                maxLength: {
                  value: 30,
                  message: "Full name should lesser than 30 words",
                },
                validate: (value) => {
                  let regex = /(^\s+)|(\s+$)/;
                  return (
                    !regex.test(value) ||
                    "Full name must not start or end with a whitespace or new line"
                  );
                },
              })}
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: 460 }} variant="standard">
            <InputLabel>Wallet address *</InputLabel>
            <Input type="text" value={walletAddress} disabled />
          </FormControl>
          <FormControl sx={{ m: 1, width: 460 }} variant="standard">
            <InputLabel>Wallet stake address *</InputLabel>
            <Input type="text" disabled value={walletRewardAddress} />
          </FormControl>
          <FormLabel component="legend" sx={{ m: 1, width: 460, pb: 0, mb: 0 }}>
            User roles
          </FormLabel>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked
                  {...register("isSmartContractDev", {})}
                />
              }
              label="Smart contract developer"
              sx={{ m: 1, mt: 0, pt: 0, width: 220 }}
            />
            <FormControlLabel
              control={
                <Checkbox defaultChecked {...register("isdAppDev", {})} />
              }
              label="dApp developer"
              sx={{ m: 1, mt: 0, pt: 0, width: 220 }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          ></Box>

          <ButtonBase
            sx={{
              mr: 1,
              alignSelf: "flex-end",
              color: "#03a9f4",
              mb: 1,
            }}
            component={Link}
            to="/"
          >
            Back
          </ButtonBase>
          <Button variant="outlined" type="submit">
            SUBMIT
          </Button>
          <Typography
            variant="caption"
            display="block"
            sx={{ m: 1, width: 460, color: "#ff9800" }}
          >
            {errors.username?.type === "required" && "Username is required."}{" "}
            {errors.fullName?.type === "required" && "Full name is required."}{" "}
            {errors.password?.type === "required" && "Password is required."}{" "}
            {errors.gitLink?.type === "pattern" &&
              `${errors.gitLink?.message}.`}{" "}
            {errors.username?.type === "validate" &&
              `${errors.username?.message}.`}
            {errors.fullName?.type === "validate" &&
              `${errors.fullName?.message}.`}{" "}
            {errors.password?.type === "pattern" &&
              `${errors.password?.message}.`}{" "}
            {errors.username?.type === "maxLength" &&
              `${errors.username?.message}.`}{" "}
            {errors.fullName?.type === "maxLength" &&
              `${errors.fullName?.message}.`}{" "}
            {errors.repeatPassword?.type === "validate" &&
              `${errors.repeatPassword?.message}.`}{" "}
            {!connected && "No connected wallet"}
          </Typography>
        </Box>
      </Box>
    </form>
  );
}

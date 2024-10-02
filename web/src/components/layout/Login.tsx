import * as React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

import {
  Avatar,
  Button,
  Card,
  CardActions,
  CircularProgress,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import {
  Form,
  required,
  TextInput,
  useTranslate,
  useLogin,
  useNotify,
  useDataProvider,
} from "react-admin";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import { generateNonce } from "@meshsdk/core";

const Login = () => {
  const { wallet, connected, connecting } = useWallet();
  const dataProvider = useDataProvider();
  const [nonce, setNonce] = React.useState("");
  const [walletRewardAddress, setWalletRewardAddress] = React.useState("");
  const [checked, setChecked] = React.useState(true);

  React.useEffect(() => {
    async function getWalletAddress() {
      const walletRewardAddress = connected
        ? await wallet.getRewardAddresses()
        : [""];

      setWalletRewardAddress(walletRewardAddress[0]);
    }

    getWalletAddress();
  }, [connected, wallet]);

  React.useEffect(() => {
    async function getWalletAddress() {
      dataProvider
        .customMethod(
          "public/getnonce",
          { filter: { walletRewardAddress: walletRewardAddress } },
          "GET"
        )
        .then((result) => setNonce(result.data))
        .catch((error) => console.error(error));
    }

    if (walletRewardAddress) getWalletAddress();
  }, [walletRewardAddress]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(!checked);
  };
  const [loading, setLoading] = useState(false);
  const translate = useTranslate();

  const notify = useNotify();
  const login = useLogin();
  const location = useLocation();

  const handleSubmit = async (auth: FormValues) => {
    setLoading(true);
    if (checked && (!wallet || !connected || !nonce)) return;

    let signature;
    if (checked) {
      signature = await wallet.signData(nonce, walletRewardAddress);
    }

    const _auth = checked
      ? {
          walletRewardAddress,
          signature,
          authType: "wallet",
        }
      : { ...auth, authType: "email" };

    login(
      _auth,
      location.state ? (location.state as any).nextPathname : "/"
    ).catch((error: Error) => {
      setLoading(false);
      notify(
        typeof error === "string"
          ? error
          : typeof error === "undefined" || !error.message
          ? "ra.auth.sign_in_error"
          : error.message,
        {
          type: "warning",
          messageArgs: {
            _:
              typeof error === "string"
                ? error
                : error && error.message
                ? error.message
                : undefined,
          },
        }
      );
    });
  };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "flex-start",
          background: "url(https://source.unsplash.com/random/1600x900)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <Card sx={{ minWidth: 300, marginTop: "6em" }}>
          <Box
            sx={{
              margin: "1em",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Avatar sx={{ bgcolor: "secondary.main" }}>
              <LockIcon />
            </Avatar>
          </Box>
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
              label="By wallet"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={!checked}
                  onChange={handleChange}
                  id="email"
                />
              }
              label="By email"
            />
          </Box>
          <Box
            sx={{
              marginTop: "1em",
              display: "flex",
              justifyContent: "center",
              color: (theme) => theme.palette.grey[500],
            }}
          >
            {/*  Hint: demo / demo */}
          </Box>
          {!checked && (
            <Box>
              <Box sx={{ padding: "0 1em 1em 1em" }}>
                <Box sx={{ marginTop: "1em" }}>
                  <TextInput
                    autoFocus
                    source="username"
                    label="Username or email"
                    disabled={loading}
                    validate={required()}
                    fullWidth
                  />
                </Box>
                <Box>
                  <TextInput
                    source="password"
                    label="Password"
                    type="password"
                    disabled={loading}
                    validate={required()}
                    fullWidth
                  />
                </Box>
              </Box>
              <CardActions
                sx={{
                  padding: "0 1em 1em 1em",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  disabled={loading}
                  fullWidth
                >
                  {loading && <CircularProgress size={25} thickness={2} />}
                  {translate("ra.auth.sign_in")}
                </Button>
                <Box flexGrow={1} sx={{ m: 0, p: 0 }}>
                  &nbsp;
                </Box>
                <Divider sx={{ width: "100%", mt: "2em" }} />
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    pr: "1em",
                    pt: "1em",
                  }}
                >
                  <Typography
                    variant="caption"
                    display="inline"
                    sx={{ textAlign: "left" }}
                  >
                    <span>
                      <Link to="/register">Register new account</Link>
                    </span>
                  </Typography>
                  <Typography
                    variant="caption"
                    display="inline"
                    sx={{ textAlign: "right" }}
                  >
                    <span>
                      <Link to="/forgotpwd">Reset password</Link>
                    </span>
                  </Typography>
                </Box>
              </CardActions>
            </Box>
          )}

          {checked && (
            <Box>
              <CardActions
                sx={{
                  padding: "2em 1em 1em 1em",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardanoWallet label="Select wallet" />

                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  disabled={loading}
                  fullWidth
                  sx={{ mt: 15 }}
                >
                  {loading && <CircularProgress size={25} thickness={2} />}
                  {translate("ra.auth.sign_in")}
                </Button>
                <Box flexGrow={1} sx={{ m: 0, p: 0 }}>
                  &nbsp;
                </Box>
                <Divider sx={{ width: "100%", mt: "2em" }} />
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    pr: "1em",
                    pt: "1em",
                  }}
                >
                  <Typography
                    variant="caption"
                    display="inline"
                    sx={{ textAlign: "left" }}
                  >
                    <span>
                      <Link to="/registerWallet">Register new wallet</Link>
                    </span>
                  </Typography>
                </Box>
              </CardActions>
            </Box>
          )}
        </Card>
      </Box>
    </Form>
  );
};

Login.propTypes = {
  authProvider: PropTypes.func,
  previousRoute: PropTypes.string,
};

export default Login;

interface FormValues {
  username?: string;
  password?: string;
}

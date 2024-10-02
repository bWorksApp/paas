import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
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

export default function Register() {
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
    const { agreedTerms, ...rest } = data;
    dataProvider
      .customMethod("auth/register", { data: { ...rest } }, "POST")
      .then((result) => {
        notify(
          "Submit successfully, please check your mail to verify your account",
          { type: "success" }
        );
      })
      .catch((error) => {
        notify(error.message, { type: "warning" });
      });
  };

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const [showRepeatPassword, setShowRepeatPassword] = React.useState(false);

  const handleClickShowRepeatPassword = () =>
    setShowRepeatPassword(!showRepeatPassword);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const preventCopyPaste = (event) => {
    event.preventDefault();
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
              mb: 0,
            }}
            onClick={() => reset()}
          >
            Clear
          </ButtonBase>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
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
            <FormControl sx={{ m: 1, width: 220 }} variant="standard">
              <InputLabel>Email *</InputLabel>
              <Input
                {...register("email", {
                  required: true,
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Must be a valid email",
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
            <InputLabel>Cardano wallet address *</InputLabel>
            <Input
              type="text"
              {...register("walletAddress", { maxLength: 300, required: true })}
            />
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
          >
            <FormControl sx={{ m: 1, width: 220 }} variant="standard">
              <InputLabel>Password *</InputLabel>
              <Input
                {...register("password", {
                  pattern: {
                    value:
                      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                    message:
                      "Password must be min 8 letters, with at least a symbol, upper and lower case letters and a number",
                  },
                })}
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl sx={{ m: 1, width: 220 }} variant="standard">
              <InputLabel>Repeat password *</InputLabel>
              <Input
                {...register("repeatPassword", {
                  validate: (val: string) => {
                    if (watch("password") !== val) {
                      return "Your passwords do not match";
                    }
                  },
                })}
                //not allow copy/paste on repeat password
                onCut={preventCopyPaste}
                onCopy={preventCopyPaste}
                onPaste={preventCopyPaste}
                type={showRepeatPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowRepeatPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showRepeatPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Box>

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
            {errors.walletAddress?.type === "required" &&
              "Cardano wallet address is required."}{" "}
            {errors.email?.type === "required" && "Email is required."}{" "}
            {errors.fullName?.type === "required" && "Full name is required."}{" "}
            {errors.password?.type === "required" && "Password is required."}{" "}
            {errors.gitLink?.type === "pattern" &&
              `${errors.gitLink?.message}.`}{" "}
            {errors.username?.type === "validate" &&
              `${errors.username?.message}.`}{" "}
            {errors.email?.type === "pattern" && `${errors.email?.message}.`}{" "}
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
          </Typography>
        </Box>
      </Box>
    </form>
  );
}

import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useDataProvider } from "react-admin";

export default function FormPropsTextFields() {
  const dataProvider = useDataProvider();

  const [state, setState] = React.useState({
    password: "",
    repeatPassword: "",
  });

  const [message, setMessage] = React.useState("");

  const handleChangePassword = (e) => {
    setState({ ...state, [e.target.id]: e.target.value });
  };

  const handleClick = () => {
    if (state.password !== state.repeatPassword) {
      setMessage("Password mismatch");
      return;
    }

    dataProvider
      .customMethod(
        "users/changepassword",
        { data: { password: state.password } },
        "POST"
      )
      .then((result) => {
        setMessage("updated password");
        setState({ password: "", repeatPassword: "" });
      })
      .catch((error) => {
        setMessage("update failed");
      }, setState({ password: "", repeatPassword: "" }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        width: 460,
      }}
    >
      <Typography variant="caption" display="block" gutterBottom sx={{ p: 1 }}>
        Min 8 letters, with at least a symbol, upper and lower case letters and
        a number
      </Typography>

      <TextField
        id="password"
        label="New password"
        type="password"
        autoComplete="current-password"
        value={state.password}
        onChange={handleChangePassword}
      />
      <TextField
        id="repeatPassword"
        label="Repeat password"
        type="password"
        autoComplete="current-password"
        value={state.repeatPassword}
        onChange={handleChangePassword}
      />
      <Button onClick={handleClick} variant="outlined">
        Update
      </Button>
      <Typography variant="caption" display="block" gutterBottom sx={{ p: 1 }}>
        {message}
      </Typography>
    </Box>
  );
}

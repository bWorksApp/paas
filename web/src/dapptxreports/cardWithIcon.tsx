import * as React from "react";
import { FC, createElement } from "react";
import { Card, Box, Typography, Divider } from "@mui/material";
import { Link, To } from "react-router-dom";
import { ReactNode } from "react";

import cartouche from "./cartouche.png";
import cartoucheDark from "./cartoucheDark.png";

interface Props {
  icon: FC<any>;
  to: To;
  title?: string;
  subtitle?: string | number;
  children?: ReactNode;
}

const CardWithIcon = (props: Props) => {
  const { icon, title, subtitle, to, children } = props;

  return (
    // @ts-ignore
    <Card
      sx={{
        mt: 2,
        minHeight: 52,
        height: 920,
        display: "flex",
        flexDirection: "column",
        flex: "1",
        "& a": {
          textDecoration: "none",
          color: "inherit",
        },
      }}
    >
      <Link to={to}>
        <Box
          sx={{
            overflow: "inherit",
            padding: "16px",
            background: (theme) =>
              `url(${
                theme.palette.mode === "dark" ? cartoucheDark : cartouche
              }) no-repeat`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            "& .icon": {
              color: (theme) =>
                theme.palette.mode === "dark" ? "inherit" : "#dc2440",
            },
          }}
        >
          <Box width="3em" className="icon">
            {createElement(icon, { fontSize: "large" })}
          </Box>
          <Box textAlign="right">
            <Typography color="textSecondary">{title}</Typography>
            <Typography variant="subtitle2" component="h2">
              {subtitle || " "}
            </Typography>
          </Box>
        </Box>
      </Link>
      {children && <Divider />}
      {children}
    </Card>
  );
};

export default CardWithIcon;

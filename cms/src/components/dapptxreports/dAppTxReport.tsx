import React, { CSSProperties } from "react";
import { useMediaQuery, Theme } from "@mui/material";
import PlutusTxs from "./dAppTxs";
import PlutusTxsChart from "./dAppTxsChart";
import PieChart from "./pieChart";
import { useTheme } from "@mui/material/styles";

const styles = {
  flex: { display: "flex" },
  flexColumn: { display: "flex", flexDirection: "column" },
  leftCol: { flex: 1, marginRight: "0.5em" },
  rightCol: { flex: 1, marginLeft: "0.5em" },
  singleCol: { marginTop: "1em", marginBottom: "1em" },
};

const DAppTxReport = () => {
  const theme = useTheme();
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmall = useMediaQuery(theme.breakpoints.down("lg"));

  return isXSmall ? (
    <div>
      <div style={styles.flexColumn as CSSProperties}>
        <PlutusTxsChart />
      </div>
    </div>
  ) : isSmall ? (
    <div style={styles.flexColumn as CSSProperties}>
      <div style={styles.singleCol}>
        <PlutusTxsChart />
      </div>
      <div style={styles.singleCol}>
        <PieChart />
      </div>
    </div>
  ) : (
    <>
      <div style={styles.flex}>
        <div style={styles.leftCol}>
          <div style={styles.singleCol}>
            <PlutusTxsChart />
          </div>
          <div style={styles.singleCol}>
            <PieChart />
          </div>
        </div>
        <div style={styles.rightCol}>
          <div style={styles.flex}>
            <PlutusTxs />
          </div>
        </div>
      </div>
    </>
  );
};

export default DAppTxReport;

import * as React from "react";
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import DynamicFeedOutlinedIcon from "@mui/icons-material/DynamicFeedOutlined";
import { useDataProvider, useTranslate } from "react-admin";
import { stringify } from "query-string";
import CardWithIcon from "./cardWithIcon";
import Table from "../components/table";
import { numberOfLockTxs } from "./sampleData";

const PlutusTXs = (props) => {
  const dataProvider = useDataProvider();

  const [postedJobs, setPlutusTXss] = React.useState(numberOfLockTxs);


/* React.useEffect(() => {
    dataProvider
      .customMethod(
        "customapis/getmonthlyplutustxsreport",
        { filter: { queryType: "emp" } },
        "GET"
      )
      .then((result) => setPlutusTXss(result.data.reverse()))
      .catch((error) => console.error(error));
  }, []); */

  const translate = useTranslate();
  const headers = [
    { key: "_id", name: "Month" },
    { key: "numberOfLockTxs", name: "Locked TXs" },
    { key: "numberOfUnlockedTxs", name: "Unlocked TXs" },
    { key: "sumLockedAmounts", name: "Locked amounts ($Ada)" },
    { key: "sumUnlockedAmounts", name: "Unlocked amount ($Ada)" },
  ];
  return (
    <CardWithIcon
      to={{
        pathname: "/plutustxs",
        search: stringify({
          filter: JSON.stringify({ status: "active" }),
        }),
      }}
      icon={DynamicFeedOutlinedIcon}
      title="Published smart contracts & Cardano TXs"
      subtitle={`Last 12 months plutus TXs`}
    >
      <Table headers={headers} data={postedJobs}></Table>
      <Box flexGrow={1}>&nbsp;</Box>
      <Button
        sx={{ borderRadius: 0 }}
        component={Link}
        to="/plutustxs"
        size="small"
        color="primary"
      >
        <Box p={1} sx={{ color: "primary.main" }}>
          {translate("pos.dashboard.allPlutusTxs")}
        </Box>
      </Button>
    </CardWithIcon>
  );
};

export default PlutusTXs;

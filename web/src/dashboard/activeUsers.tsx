import * as React from "react";
import CustomerIcon from "@mui/icons-material/PersonAdd";
import { useTranslate } from "react-admin";
import { subDays } from "date-fns";

import CardWithIcon from "./cardWithIcon";

interface Props {
  dAppDevs: number;
  contractDevs: number;
}

const ActiveUsers = (props: Props) => {
  const { dAppDevs = 0, contractDevs = 0 } = props;

  const aMonthAgo = subDays(new Date(), 30);
  aMonthAgo.setDate(aMonthAgo.getDate() - 30);
  aMonthAgo.setHours(0);
  aMonthAgo.setMinutes(0);
  aMonthAgo.setSeconds(0);
  aMonthAgo.setMilliseconds(0);

  return (
    <CardWithIcon
      to="/users"
      icon={CustomerIcon}
      title="Active users"
      subtitle={`${dAppDevs} dApp developers, ${contractDevs} contract developers`}
    ></CardWithIcon>
  );
};

export default ActiveUsers;

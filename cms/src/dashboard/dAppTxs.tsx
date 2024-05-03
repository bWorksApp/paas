import * as React from "react";
import DollarIcon from "@mui/icons-material/AttachMoney";
import CardWithIcon from "./cardWithIcon";

interface Props {
  numberOfJobs: number;
  totalAmount: number;
}

const dAppTxs = (props: Props) => {
  const { numberOfJobs = 0, totalAmount = 0 } = props;
  return (
    <CardWithIcon
      to="/plutustxs"
      icon={DollarIcon}
      title="dApp transactions"
      subtitle={`${numberOfJobs} TXs, ${totalAmount} Ada`}
    />
  );
};

export default dAppTxs;

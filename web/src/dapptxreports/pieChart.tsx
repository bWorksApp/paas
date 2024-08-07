import * as React from "react";
import { Card, CardHeader, CardContent } from "@mui/material";
import { ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useDataProvider } from "react-admin";
import { PieChart, Pie, Cell } from "recharts";
import Typography from "@mui/material/Typography";

const PaymentChart = () => {
  const isAuthenticated = true;
  const chartHeight = isAuthenticated ? 320 : 390;
  const fullName =
    localStorage.getItem("fullName") || localStorage.getItem("username") || "";
  const dataProvider = useDataProvider();

  const [data, setData] = React.useState({
    _id: "sumdAppTxs",
    numberOfLockTxs: 0,
    numberOfUnlockedTxs: 0,
    sumUnlockedAmounts: 0,
    sumLockedAmounts: 0,
  });

  const [userData, setUserData] = React.useState({
    _id: "sumdAppTxs",
    numberOfLockTxs: 0,
    numberOfUnlockedTxs: 0,
    sumUnlockedAmounts: 0,
    sumLockedAmounts: 0,
  });

  React.useEffect(() => {
    dataProvider
      .customMethod("customapis/sumdAppTxsByUser", { filter: {} }, "GET")
      .then((result) => setUserData(result.data))
      .catch((error) => console.error(error));
  }, []);

  React.useEffect(() => {
    dataProvider
      .customMethod("customapis/sumdapptxs", { filter: {} }, "GET")
      .then((result) => setData(result.data))
      .catch((error) => console.error(error));
  }, []);

  const lockData = [
    { name: "Unlocked TXs", value: data.numberOfUnlockedTxs },
    {
      name: "Pending TXs",
      value: data.numberOfLockTxs - data.numberOfUnlockedTxs,
    },
  ];
  const amountData = [
    { name: "Unlocked amounts", value: data.sumUnlockedAmounts },
    {
      name: "Pending amounts",
      value: data.sumLockedAmounts - data.sumUnlockedAmounts,
    },
  ];
  const COLORS = ["#0088FE", "#FF8042"];
  const COLORS1 = ["#00C49F", "#FFBB28"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card>
      <CardHeader
        sx={{ mb: 0, pb: 0 }}
        title="dApp TXs:"
        titleTypographyProps={{ variant: "subtitle1" }}
        subheader={
          <Typography variant="subtitle2" gutterBottom>
            {`Locked TXs: ${data.numberOfLockTxs}, Unlocked TXs: ${data.numberOfUnlockedTxs}, Locked amounts ($Ada): ${data.sumLockedAmounts}, Unlocked amounts ($Ada): ${data.sumUnlockedAmounts}`}
          </Typography>
        }
      />
      {isAuthenticated && (
        <CardHeader
          sx={{ mt: 0, pt: 0 }}
          title={`dApp TXs by ${fullName}:`}
          titleTypographyProps={{
            variant: "subtitle1",
          }}
          subheader={
            <Typography variant="subtitle2" gutterBottom>
              {`Locked TXs: ${userData.numberOfLockTxs}, Unlocked TXs: ${userData.numberOfUnlockedTxs}, Locked amounts ($Ada): ${userData.sumLockedAmounts}, Unlocked amounts ($Ada): ${userData.sumUnlockedAmounts}`}
            </Typography>
          }
        />
      )}
      <CardContent>
        <div
          style={{
            width: "100%",
            height: chartHeight,
            display: "flex",
            flexDirection: "row",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={lockData}
                cx="25%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                animationDuration={1000}
              >
                {lockData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Pie
                data={amountData}
                cx="75%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {amountData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS1[index % COLORS1.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentChart;

import * as React from "react";
import { Card, CardHeader, CardContent } from "@mui/material";
import Typography from "@mui/material/Typography";
import { RichTextField } from "react-admin";
import { useDataProvider } from "react-admin";
const fullName =
  localStorage.getItem("fullName") || localStorage.getItem("username") || "";

const News = () => {
  const [data, setData] = React.useState({ id: 0, description: "" });
  const dataProvider = useDataProvider();

  React.useEffect(() => {
    dataProvider
      .customMethod("public/news", { filter: { isActive: true } }, "GET")
      .then((result) => {
        setData(result.data[0]);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <Card>
        <CardContent sx={{ mb: 0, pb: 0 }}>
          <Typography variant="caption">
            <strong>
              <i>Cardano news</i>
            </strong>
          </Typography>
          <RichTextField
            record={data}
            source="description"
            sx={{ m: 0, p: 0 }}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default News;

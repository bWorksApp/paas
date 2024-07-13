import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DateField,
  RichTextField,
  ReferenceField,
  useRecordContext,
  useGetList,
  useUpdate,
  useRefresh,
  Labeled,
  NumberField,
  BooleanField,
  TextInput,
  BooleanInput,
  ReferenceInput,
  AutocompleteInput,
  FunctionField,
  UrlField,
} from "react-admin";
import Button from "@mui/material/Button";
import LinkResoureField from "../components/linkResourceField";
import ShowJob from "../components/showButton";
import Link from "@mui/material/Link";
import { CreateButton, ExportButton, TopToolbar } from "react-admin";
import { Box, Typography } from "@mui/material";

const ListScreen = () => {
  const ListActions = () => (
    <TopToolbar>
      <CreateButton label="Publish new contract" />
      <ExportButton />
    </TopToolbar>
  );

  const Empty = () => (
    <Box textAlign="left">
      <Typography variant="h6">No published smart contract</Typography>
      <CreateButton label="Publish new contract" />
    </Box>
  );

  const ExpandPanel = () => {
    const record = useRecordContext();
    const { data, total, isLoading, error } = useGetList("queues", {
      pagination: { page: 1, perPage: 10 },
      sort: { field: "createdAt", order: "DESC" },
      filter: { data: { name: record?.name } },
    });
    if (isLoading) {
      return <p>LOADING...</p>;
    }
    if (error) {
      return <p>ERROR</p>;
    }

    return (
      <Box
        component="div"
        sx={{ width: 1500, whiteSpace: "initial", wordWrap: "break-word" }}
      >
        <strong>Github: </strong>
        <Link href={record.gitLink} target="_blank">
          {record.gitLink}
        </Link>
        <br />
        <strong>Get contract: </strong>
        <FunctionField
          render={(record) =>
            `curl -X 'GET' 'https://paas.bworks.app/api/contracts/${record._id}' -H "Accept: application/json" -H "Authorization: Bearer {token}"`
          }
        />
        <br />
        {record.description && (
          <>
            <strong>Contract description: </strong>
            <div dangerouslySetInnerHTML={{ __html: record.description }} />
            <br />
          </>
        )}

        <strong>Compile status: </strong>
        <div dangerouslySetInnerHTML={{ __html: JSON.stringify(data[0]) }} />
      </Box>
    );
  };

  const [record, setRecord] = React.useState(null);

  const rowClick = (id, resource, record) => {
    setRecord(record);
    return null;
  };

  const filterToQuery = (searchText) => ({ textSearch: searchText });

  const filters = [
    <TextInput
      label="Search"
      source="textSearch"
      alwaysOn
      sx={{ width: 300 }}
    />,

    <BooleanInput
      label="Audited contracts"
      source="isFunctionVerified"
      alwaysOn
    />,
  ];

  return (
    <List
      perPage={25}
      sort={{ field: "createdAt", order: "desc" }}
      resource="publishcontracts"
      filters={filters}
      actions={<ListActions />}
      empty={<Empty />}
    >
      <Datagrid
        bulkActionButtons={false}
        rowClick={rowClick}
        expand={<ExpandPanel />}
      >
        <TextField source="name" />

        <TextField source="contractType" />
        <BooleanField source="isCompiled" />
        <BooleanField source="isSourceCodeVerified" />
        <BooleanField source="isFunctionVerified" />
        <BooleanField source="isApproved" />
        <LinkResoureField resource="plutustxs" />
        <DateField source="createdAt" label="Published at" showTime />
        <EditButton />
        <ShowJob customLabel="Detail" label="View detail" />
      </Datagrid>
    </List>
  );
};

export default ListScreen;

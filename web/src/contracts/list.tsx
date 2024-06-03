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

const ListScreen = () => {
  const ExpandPanel = () => {
    const record = useRecordContext();

    return (
      <>
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
        <div dangerouslySetInnerHTML={{ __html: record.description }} />
      </>
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
    <ReferenceInput source="author" reference="users" alwaysOn>
      <AutocompleteInput
        filterToQuery={filterToQuery}
        fullWidth
        optionText="username"
        label="Search by user"
        sx={{ width: 300 }}
      />
    </ReferenceInput>,
    <BooleanInput
      label="Audited contracts"
      source="isFunctionVerified"
      alwaysOn
    />,
  ];

  return (
    <List
      perPage={25}
      sort={{ field: "date", order: "desc" }}
      resource="contracts"
      hasCreate={false}
      filters={filters}
    >
      <Datagrid
        bulkActionButtons={false}
        rowClick={rowClick}
        expand={<ExpandPanel />}
      >
        <TextField source="name" />
        <ReferenceField source="author" reference="users">
          <TextField source="fullName" />
        </ReferenceField>
        <TextField source="contractType" />
        <BooleanField source="isCompiled" />
        <BooleanField source="isSourceCodeVerified" />
        <BooleanField source="isFunctionVerified" />
        <BooleanField source="isApproved" />
        <LinkResoureField resource="plutustxs" />
        <DateField source="createdAt" label="Published at" showTime />
        <ShowJob customLabel="Detail" label="View detail" />
      </Datagrid>
    </List>
  );
};

export default ListScreen;

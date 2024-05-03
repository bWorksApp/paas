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
} from "react-admin";
import Button from "@mui/material/Button";
import LinkResoureField from "../components/linkResourceField";

const ListScreen = () => {
  const SelectButton = (props) => {
    const record = useRecordContext();
    const diff = { isApproved: !record.isApproved };
    const refresh = useRefresh();
    const [update, { isLoading, error }] = useUpdate("contracts", {
      id: record.id,
      data: diff,
      previousData: record,
    });

    const handleClick = () => {
      update();
    };

    React.useEffect(() => {
      refresh();
    }, [isLoading, error]);

    return (
      <Labeled>
        <Button variant="text" onClick={handleClick}>
          {record.isApproved ? "Disapprove" : "Approve"}
        </Button>
      </Labeled>
    );
  };

  const NumberOfUsers = (props) => {
    const record = useRecordContext();
    if (!record.isApproved) return null;
    return (
      <Labeled>
        <span>{record.submittedUsers}</span>
      </Labeled>
    );
  };

  return (
    <List
      perPage={25}
      sort={{ field: "date", order: "desc" }}
      resource="contracts"
      hasCreate={false}
    >
      <Datagrid bulkActionButtons={false}>
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

        <RichTextField source="description" />
        <DateField source="createdAt" label="Published at" showTime />
        <SelectButton label="Approve"></SelectButton>
      </Datagrid>
    </List>
  );
};

export default ListScreen;

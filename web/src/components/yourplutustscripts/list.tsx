import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DateField,
  RichTextField,
  ReferenceField,
} from "react-admin";

const ListScreen = () => {
  return (
    <List
      perPage={25}
      sort={{ field: "date", order: "desc" }}
      hasCreate
      resource="contracts"
      filter={{queryType: "developer"}}
    >
      <Datagrid>
        <TextField source="name" />
        <TextField source="address" />
        <ReferenceField source="author" reference="users">
          <TextField source="fullName" />
        </ReferenceField>{" "}
        <RichTextField source="description" />
        <DateField source="createdAt" showTime />
        <EditButton />
      </Datagrid>
    </List>
  );
};

export default ListScreen;

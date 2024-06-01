import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DateField,
  ReferenceField,
  NumberField,
  useRecordContext,
  FunctionField,
  RichTextField,
  ArrayField,
  SingleFieldList,
  ChipField,
  TopToolbar,
  CreateButton,
} from "react-admin";

const Actions = () => (
  <TopToolbar>
    <CreateButton label="Generate new token" />
  </TopToolbar>
);
const ListScreen = () => {
  return (
    <List
      perPage={25}
      sort={{ field: "date", order: "desc" }}
      resource="accesstokens"
      hasCreate={true}
      actions={<Actions />}
    >
      <Datagrid bulkActionButtons={false}>
        <FunctionField
          label="Token"
          render={(record) => (
            <span
              style={{
                width: 700,
                display: "inline-block",
                wordWrap: "break-word",
              }}
            >
              {record.token}
            </span>
          )}
        />
        <ArrayField source="dApps" label="dApps">
          <SingleFieldList linkType={false}>
            <ChipField source="name" size="small" />
          </SingleFieldList>
        </ArrayField>
        <DateField source="expire" label="Expired at" showTime />
        <RichTextField source="description" label="Notes" />
        <EditButton />
      </Datagrid>
    </List>
  );
};

export default ListScreen;

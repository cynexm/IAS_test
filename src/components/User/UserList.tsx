import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  BooleanField,
  DateField,
  ReferenceField,
  FunctionField
} from "react-admin";
export const UserList = props => (
  <List
    {...props}
    style={{ minWidth: "1300px" }}
    bulkActions={false}
    title="resources.users.name"
  >
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="username" />
      <TextField source="first_name" style={{ textTransform: "capitalize" }} />
      <TextField source="last_name" style={{ textTransform: "capitalize" }} />
      <ReferenceField source="institute" reference="institutes">
        <TextField source="name" />
      </ReferenceField>
      <EmailField source="email" />
      {/* 内部账号 */}
      <BooleanField source="is_intlacc" />
      {/* 管理员账号 */}
      <BooleanField source="is_staff" />
      <DateField source="last_login" />
      <FunctionField
        source="last_activity"
        render={record =>
          `${
            record.last_activity
              ? record.last_activity.slice(0, 16).replace("T", " ")
              : ""
          }`
        }
      />
    </Datagrid>
  </List>
);

import React from "react";
import {
  Datagrid,
  DateField,
  List,
  NumberField,
  ReferenceField,
  TextField,
} from "react-admin";
import { TransField } from "../common/TransField";

export const PositionList = (props) => (
  <List {...props} bulkActions={false}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <ReferenceField source="portfolio" reference="portfolio">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="security" reference="securities">
        <TextField source="name" />
      </ReferenceField>
      <TransField
        style={{ textTransform: "capitalize" }}
        source="side"
        transKey="valueTrans.positionSide"
      />
      <NumberField source="initial_px" />
      <NumberField source="initial_notional_unit" />
      <DateField source="created" showTime />
      <NumberField source="notional_unit" />
    </Datagrid>
  </List>
);

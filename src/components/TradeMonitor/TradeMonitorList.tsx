import { createStyles, withStyles } from "@material-ui/core";
import React from "react";
import {
  AutocompleteInput,
  BooleanField,
  Datagrid,
  DateInput,
  DateField,
  List,
  NumberField,
  ReferenceField,
  TextField,
  Filter,
  SearchInput,
  SelectInput,
  ReferenceInput,
} from "react-admin";
import { TransField } from "../common/TransField";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";

const useStyles = {
  centerHeader: {
    textAlign: "center",
  },
} as any;

const TradeFilter = (props) => (
  <Filter {...props}>
    {/*<SearchInput source="q" alwaysOn />*/}
    <ReferenceInput source="user" reference="users" alwaysOn>
      <AutocompleteInput optionText={(choice) => `${choice.username}`} />
    </ReferenceInput>
    <ReferenceInput source="portfolio" reference="portfolio" alwaysOn>
      <SelectInput source="name" />
    </ReferenceInput>
    <DateInput source="created_gte" />
    <DateInput source="created_lte" />
  </Filter>
);

export const TradeMonitorList = withStyles(useStyles)(
  ({ classes, ...props }: any) => {
    return (
      <List
        {...props}
        bulkActions={false}
        sort={{ field: "last_modified", order: "DESC" }}
        filters={<TradeFilter />}
        title="resources.tm.name"
      >
        <Datagrid
          rowClick="show"
          rowStyle={(row) => ({
            borderLeft: "4px solid",
            borderLeftColor: row.is_buy ? green[400] : red[400],
          })}
        >
          <TextField source="id" />
          <ReferenceField
            headerClassName={classes.centerHeader}
            source="security"
            reference="securities"
            linkType={false}
          >
            <TextField source="name" align="center" />
          </ReferenceField>
          <ReferenceField
            headerClassName={classes.centerHeader}
            source="portfolio"
            reference="portfolio"
          >
            <TextField source="name" align="center" />
          </ReferenceField>
          <TransField
            headerClassName={classes.centerHeader}
            source="is_buy"
            align="center"
            transKey="valueTrans.isBuy"
            keyInter={(isBuy) => (isBuy ? "buy" : "sell")}
          ></TransField>
          {/* <BooleanField
          source="is_buy"
          align="center"
          headerClassName={classes.centerHeader}
        /> */}
          {/*<TextField*/}
          {/*source="trx_purpose"*/}
          {/*align="center"*/}
          {/*headerClassName={classes.centerHeader}*/}
          {/*/>*/}
          <TransField
            headerClassName={classes.centerHeader}
            source="trx_purpose"
            align="center"
            transKey="valueTrans.purpose"
          ></TransField>
          {/* <BooleanField source="confirmed" align="center" />
        <BooleanField source="is_increase" align="center" /> */}
          <NumberField source="notional_unit" />
          {/* <TextField source="currency" align="center" /> */}
          {/* <TransField
          style={{ textTransform: "capitalize", textAlign: "center" }}
          headerClassName={classes.centerHeader}
          source="execution_type"
          transKey="valueTrans.executionType"
        /> */}
          <ReferenceField
            source="user"
            reference="users"
            headerClassName={classes.centerHeader}
          >
            <TextField source="username" align="center" />
          </ReferenceField>
          {/* <TextField source="reason_txt" />
      <TextField source="reason_audio" /> */}
          <DateField source="created" align="left" showTime />
          <DateField source="last_modified" align="left" showTime />
          {/* <NumberField source="execution.id" /> */}
        </Datagrid>
      </List>
    );
  }
);

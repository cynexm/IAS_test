import React, { useEffect, useMemo, useState } from "react";
import { pick, uniq } from "lodash";
import { Paper, Typography } from "@material-ui/core";

import { GET_LIST, withDataProvider, CreateButton } from "react-admin";

import storage, { Storage } from "../../core/Storage";
import { DataTable } from "../common";
import {
  userColumns,
  detailColumns,
  securityListColumns,
} from "./PoolSettings";

export const SecuritiesPoolList = withDataProvider(
  ({ resource, dataProvider, basePath }: any) => {
    const username = storage.get(Storage.Keys.AuthUser);

    const [listData, setListData] = useState([]);

    const rowData = useMemo(() => {
      const fields = securityListColumns.map(({ field }) => field);
      const securities = uniq(listData.map(({ security }) => security));

      return securities.map((securityId: number) => {
        const tableData = listData.filter(
          ({ security }) => security === securityId
        );
        const item = pick(tableData[0], fields);
        return {
          ...item,
          count: tableData.length,
          tableData: tableData,
        };
      });
    }, [listData]);

    const userData = useMemo(
      () => listData.filter(({ user_name }) => user_name === username),
      [listData]
    );

    const SpanElement = ({ row }) => (
      <div className="sectionContainer">
        <Typography variant="subheading">Analysis</Typography>
        <Typography className="richText">{row.params_analysis}</Typography>
      </div>
    );

    const DetailTable = ({ row }: any) => {
      return (
        <DataTable
          rows={row.tableData}
          columns={detailColumns}
          resource={resource}
          CollapseElement={SpanElement}
          wrapperComponent={Paper}
        />
      );
    };

    const loadData = async () => {
      const result = await dataProvider(GET_LIST, "pool");
      setListData(result.data);
    };
    useEffect(() => {
      loadData();
    }, []);

    return (
      <Paper style={{ padding: 15 }}>
        <div className="sectionContainer">
          <CreateButton basePath={basePath} color="primary" resource="pool" />
        </div>

        <div className="sectionContainer">
          <DataTable
            rows={rowData}
            columns={securityListColumns.filter((item) => !item.hidden)}
            CollapseElement={DetailTable}
            resource={resource}
            title="title"
            keyField="security"
            size="medium"
          />
        </div>
        <div className="sectionContainer">
          <DataTable
            rows={userData}
            columns={userColumns}
            CollapseElement={SpanElement}
            resource={resource}
            title="mypool"
          />
        </div>
      </Paper>
    );
  }
);

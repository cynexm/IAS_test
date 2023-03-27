import {withStyles} from "@material-ui/core";
import React, {Fragment, useEffect, useState} from "react";
import {
  AutocompleteInput,
  BooleanInput,
  Datagrid,
  DateInput,
  Filter,
  List,
  NumberField,
  ReferenceInput,
  TextInput,
  SelectInput,
  TextField,
  BulkDeleteButton,
  BooleanField,
  downloadCSV,
} from "react-admin";
import {unparse as convertToCSV} from "papaparse/papaparse.min";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";
import blueGrey from "@material-ui/core/colors/blueGrey";
import {TransField, LinkedField} from "../common/";
import {getAllPortfolios, getAllUsers} from "../../providers/api";

const useStyles = {
  centerHeader: {
    textAlign: "center",
  },
  price: {color: "purple"},
} as any


const TradeFilter = (props) => {
  // 用户姓名
  const tmpUsernameList: any[] = []
  const [usernameList, setUsernameList] = useState<any[]>([])

  // 模拟组合
  const tmpPortfolioList: any[] = []
  const [portfolioList, setPortfolioList] = useState<any[]>([])

  // 交易方向
  const buyTypeList = [
    {
      "id": false,
      "name": "卖出"
    },
    {
      "id": true,
      "name": "买入"
    }
  ]

  // 交易目的
  const trxPurposeList = [
    {
      "id": "open",
      "name": "建仓"
    },
    {
      "id": "add",
      "name": "加仓"
    },
    {
      "id": "reduce",
      "name": "减仓"
    },
    {
      "id": "close",
      "name": "清仓"
    },
    {
      "id": "decay",
      "name": "自动减仓"
    },
    {
      "id": "decaycancle",
      "name": "自动减仓取消"
    }
  ]

  useEffect(() => {
    getAllUsers().then((res: any) => {
      // console.log('getAllUsers >> ', res)
      if (res && res?.results?.length) {
        tmpUsernameList.length = 0
        res.results.forEach(v => {
          tmpUsernameList.push({
            id: v.id,
            name: v.username
          })
        })

        setUsernameList([...tmpUsernameList])
      }
    }).catch(err => {
      console.error("getAllUsers >> ", err)
    })

    getAllPortfolios()
      .then((res: any) => {
        // console.log("getAllPortfolios >> ", res)
        if (res && res?.results?.length) {
          tmpPortfolioList.length = 0
          res.results.forEach(v => {
            tmpPortfolioList.push({
              id: v.id,
              name: v.name
            })
          })

          setPortfolioList([...tmpPortfolioList])
        }
      }).catch(err => {
      console.error("getAllPortfolios >> ", err)
    })
  }, [])


  return (
    <Filter {...props}>
      {/* 用户姓名 */}
      <AutocompleteInput source="user" choices={usernameList} alwaysOn/>

      {/* 模拟组合 */}
      <AutocompleteInput source="portfolio" choices={portfolioList} alwaysOn/>

      {/* Ticker */}
      <TextInput source="ticker" alwaysOn/>

      {/* 交易方向 */}
      <SelectInput source="is_buy" choices={buyTypeList} alwaysOn/>

      {/* 交易目的 */}
      <SelectInput source="trx_purpose" choices={trxPurposeList} alwaysOn/>

      {/* Hide Internal */}
      <BooleanInput label="Hide Internal" source="internal" alwaysOn/>
      <DateInput source="created_gte"/>
      <DateInput source="created_lte"/>
    </Filter>
  )
};

const StyledBooleanField = ({source, record, ...props}: any) => (
  <BooleanField
    source={source}
    record={record}
    {...props}
    style={{
      color: record.status === 1 && !record.confirmed ? "red" : "inherit",
    }}
  />
);

const StyledTransFieldReduce = ({source, record, ...props}: any) => (
  <TransField
    {...props}
    record={record}
    source={source}
    align="center"
    transKey="valueTrans.reduce_stock_status"
    style={{
      color: record.reduce_stock_status === 3 ? "#ccc" :
        record.reduce_stock_status === 2 ? "red" : "green",
    }}
  />
);

StyledBooleanField.defaultProps = {
  addLabel: true,
};

const OrderBulkActionButtons = (props) => (
  <Fragment>
    {/* Add the default bulk delete action */}
    <BulkDeleteButton {...props} />
  </Fragment>
);

const exporter = (json) => {
  const dataForExport = json.map((item) => {
    const STATUS_DICT = ["pending", "approved", "cancelled"];
    const {execution, is_buy, status, ...postForExport} = item;
    postForExport.is_buy = is_buy ? "buy" : "sell";
    postForExport.status = STATUS_DICT[status];
    postForExport.execution_approved_unit = execution
      ? execution.approved_unit
      : null;
    postForExport.avg_fill_price = execution ? execution.avg_fill_price : null;
    postForExport.cost = execution ? execution.cost : null;
    postForExport.cost_bps = execution ? execution.cost_bps : null;
    postForExport.filled_time = execution ? execution.filled_time : null;

    return postForExport;
  });

  const csv = convertToCSV(
    {
      data: dataForExport,
      fields: [
        "id",
        "security",
        "ticker",
        "portfolio",
        "portfolio_name",
        "status",
        "user",
        "notional_unit",
        "execution_type",
        "trx_purpose",
        "created",
        "execution_approved_unit",
        "avg_fill_price",
        "cost",
        "cost_bps",
        "filled_time",
        "position_notional",
        "reason_txt",
      ], // order fields in the export
    },
    {quotes: true}
  );
  downloadCSV("\ufeff " + csv, "orders"); // download as 'posts.csv` file
};

export const OrderList = withStyles(useStyles)(
  ({classes, permissions, ...props}: any) => {
    const {location} = props;
    const search = location.search?.substring(1);
    const params = search
      ? JSON.parse(
        "{\"" +
        decodeURI(search)
          .replace(/"/g, "\\\"")
          .replace(/&/g, "\",\"")
          .replace(/=/g, "\":\"") +
        "\"}"
      )
      : null;

    return (
      <List
        {...props}
        bulkActionButtons={permissions === "apm" && <OrderBulkActionButtons/>}
        sort={{field: "last_modified", order: "DESC"}}
        filters={permissions === "apm" ? <TradeFilter/> : null}
        title="resources.order.name"
        style={{minWidth: "1600px"}}
        exporter={exporter}
        filter={params}
      >
        <Datagrid
          rowClick="show"
          rowStyle={(row) => ({
            borderLeft: "4px solid",
            borderLeftColor: row.is_buy ? green[400] : red[400],
            background:
              row.status === 0
                ? red[50]
                : row.status === 2
                  ? blueGrey[50]
                  : "transparent",
          })}
        >
          {permissions === "apm" && <TextField source="id"/>}

          {/* 订单编号 */}
          <TextField source="sn"/>

          {/* 公司名称 */}
          <TextField
            label="resources.order.fields.security"
            source="security_name"
          />

          {/* 股票代码 */}
          <TextField label="resources.order.fields.ticker" source="ticker"/>

          {/* 模拟组合 */}
          <LinkedField
            source="portfolio"
            resourceName="portfolio"
            displayText="portfolio_name"
          />

          {/*  */}
          {permissions === "vpm" && (
            <TextField
              sortable={false}
              label="resources.order.fields.portfolio"
              source="portfolio_name"
            />
          )}

          {/* 交易方向 */}
          <TransField
            headerClassName={classes.centerHeader}
            source="is_buy"
            align="center"
            transKey="valueTrans.isBuy"
            keyInter={(isBuy) => (isBuy ? "buy" : "sell")}
          ></TransField>

          {/* 原因确认 */}
          <StyledBooleanField source="confirmed"/>

          {/* 订单状态 */}
          <TransField
            transKey="valueTrans.orderStatus"
            headerClassName={classes.centerHeader}
            align="center"
            source="status"
            style={{textTransform: "capitalize"}}
          />

          {/* 交易目的 */}
          <TransField
            headerClassName={classes.centerHeader}
            source="trx_purpose"
            align="center"
            transKey="valueTrans.purpose"
          ></TransField>

          {/*
            <BooleanField source="confirmed" align="center" />
            <BooleanField source="is_increase" align="center" />
          */}

          <NumberField source="notional_unit"/>
          <NumberField source="execution.approved_unit" sortable={false}/>
          <NumberField
            source="execution.moment_px"
            sortable={false}
            options={{minimumFractionDigits: 2, maximumFractionDigits: 2}}
          />
          <NumberField
            source="execution.avg_fill_price"
            sortable={false}
            options={{minimumFractionDigits: 2, maximumFractionDigits: 2}}
          />
          {/* 交易成本 */}
          <NumberField
            source="execution.cost"
            sortable={false}
            options={{maximumFractionDigits: 0}}
          />
          {/* <TextField source="currency" align="center" /> */}
          {/* 执行方式 */}
          <TransField
            style={{textTransform: "capitalize", textAlign: "center"}}
            headerClassName={classes.centerHeader}
            source="execution_type"
            transKey="valueTrans.executionType"
          />
          {/* 自动减仓状态（需求变更，临时注释） */}
          {/*<StyledTransFieldReduce source="reduce_stock_status"/>*/}
          {/* 用户姓名 */}
          <LinkedField
            source="user"
            displayText="user_name"
            resourceName="users"
            align="center"
          />

          {/* 订单创建时间 */}
          <TextField source="created"/>

          {/* 最后更新时间 */}
          <TextField source="last_modified"/>
        </Datagrid>
      </List>
    );
  }
);

import React, { useEffect, useState, FC } from "react";
import {
  Button,
  AutocompleteInput,
  ArrayField,
  BooleanInput,
  Datagrid,
  Filter,
  FunctionField,
  List,
  NumberField,
  Pagination,
  ReferenceInput,
  ReferenceArrayField,
  SingleFieldList,
  SelectInput,
  TextField,
  downloadCSV,
} from "react-admin";

import * as PropTypes from "prop-types";
import { Drawer } from "@material-ui/core";
import { Record } from "ra-core";
import ParamUpdateForm from "./ParamUpdateForm";
import { unparse as convertToCSV } from "papaparse/papaparse.min";

const UpdateButton: FC<EditButtonProps> = ({ record, callback, ...rest }) => (
  <Button
    label={"Update Param"}
    onClick={(e) => {
      e.stopPropagation();
      console.log("portfolio", record);
      callback(record);
    }}
    {...(rest as any)}
  ></Button>
);

interface EditButtonProps {
  record?: Record;
  callback: any;
}

UpdateButton.propTypes = {
  record: PropTypes.any,
  callback: PropTypes.func.isRequired,
};

// 组合管理列表筛选过滤器
const TradeFilter = (props) => (
  <Filter {...props}>
    {/*<SearchInput source="q" alwaysOn />*/}
    <ReferenceInput source="user" reference="users" alwaysOn>
      <AutocompleteInput optionText={(choice) => `${choice.username}`} />
    </ReferenceInput>
    <ReferenceInput source="institute" reference="institutes" alwaysOn>
      <SelectInput source="name" />
    </ReferenceInput>
    <BooleanInput label="Hide Internal" source="internal" alwaysOn />
    {/* <BooleanInput label="View Inactive" source="inactive" alwaysOn /> */}
  </Filter>
);

const MyDatagrid = ({ history, permissions, ...props }) => {
  const { ids, isLoading, loadedOnce } = props;

  useEffect(() => {
    if (permissions === "vpm" && !isLoading && loadedOnce && ids.length === 1) {
      history.push("/portfolio/" + ids[0] + "/show");
    }
  });

  return <Datagrid {...props} />;
};

const ConditionalFunctionField = ({ ...props }) => {
  const { record } = props;
  return record &&
    record.summary &&
    (record.summary.market_cap / record.book_size > 0.8 ||
      record.summary.market_cap / record.book_size < 0.4) ? (
    <FunctionField {...props} style={{ color: "red" }} />
  ) : (
    <FunctionField {...props} />
  );
};

const exporter = (json) => {

  console.log('json: ', json)

  const dataForExport = json.map((item) => {
    const {
      summary,
      ytd_alpha,
      ytd_pnl,
      mtd_pnl,
      mtd_alpha,
      managers,
      ...postForExport
    } = item;
    postForExport.ytd_alpha = ytd_alpha + summary.alpha;
    postForExport.ytd_pnl = ytd_pnl + summary.pnl;

    postForExport.mtd_pnl = mtd_pnl + summary.pnl;
    postForExport.mtd_alpha = mtd_alpha + summary.alpha;
    postForExport.users = managers
      .map((manager) => manager.full_name || manager.username)
      .join(", ");


    console.log('postForExport: ', postForExport)

    return postForExport;
  });

  const csv = convertToCSV(
    {
      data: dataForExport,
      fields: [
        "id",
        "name",
        "created",
        "book_size",
        "currency",
        "invested_size",
        "ytd_alpha",
        "ytd_pnl",
        "mtd_alpha",
        "mtd_pnl",
        "admin_rating",
        "urgency",
        "users",
        "last_traded",
        "days_idle",
        "description",
      ], // order fields in the export
    },
    { quotes: true }
  );
  downloadCSV("\ufeff " + csv, "orders"); // download as 'posts.csv` file
};

export const PortfolioList = ({ history, permissions, ...props }) => {
  const [paramDrawer, setParamDrawer] = useState(false);
  const [portfolio, setPortfolio] = useState(null);

  const setParamInputs = (record) => {
    setParamDrawer(true);
    setPortfolio(record);
  };

  return (
    <>
      <Drawer
        anchor="bottom"
        open={paramDrawer}
        onClose={() => setParamDrawer(false)}
      >
        <ParamUpdateForm
          onUpdateSuccess={() => setParamDrawer(false)}
          record={portfolio}
          {...props}
        />
      </Drawer>
      <List
        {...props}
        filters={permissions === "apm" ? <TradeFilter /> : null}
        filterDefaultValues={{ internal: true }}
        title="resources.portfolio.name"
        style={{ minWidth: "1630px" }}
        perPage={50}
        exporter={exporter}
        pagination={<Pagination rowsPerPageOptions={[25, 50, 100]} />}
      >
        <MyDatagrid
          history={history}
          permissions={permissions}
          rowClick="show"
          {...props}
        >
          {/* 组合 ID */}
          {permissions === "apm" && <NumberField source="id" />}

          {/* 组合名称 */}
          <TextField source="name" />

          {/* <TextField source="description" /> */}

          {/*
          <NumberField
            source="book_size" 
            sortable={permissions === "apm"} />
          */}

          {/* 组合设定规模(人民币) */}
          <FunctionField
            source="book_size"
            sortable={permissions === "apm"}
            render={(record) => `${Math.round(record.book_size / 1000000)}M`}
            textAlign="right"
          />

          {/*
          <NumberField
            source="invested_size"
            sortable={permissions === "apm"}
          />
          */}

          {/* 已使用头寸 */}
          <FunctionField
            source="invested_size"
            sortable={permissions === "apm"}
            render={(record) =>
              `${Math.round(record.invested_size / 1000000)}M`
            }
            textAlign="right"
          />

          {/* 实际市值 */}
          <FunctionField
            source="summary.market_cap"
            sortable={permissions === "apm"}
            render={(record) =>
              `${Math.round(record.summary.market_cap / 1000000)}M`
            }
            textAlign="right"
          />

          {/* 当前实际仓位 */}
          <ConditionalFunctionField
            source="summary.current_position"
            render={(record) =>
              `${(
                (record.summary.actual_position * 100) /
                record.book_size
              ).toFixed(2)}%`
            }
            textAlign="right"
          />


          {/* 风险敞口 */}
          <NumberField
            source="summary.market_exposure"
            sortable={permissions === "apm"}
            options={{ style: "percent", maximumFractionDigits: 2 }}
          />

          {/* MTD回报 */}
          <FunctionField
            source="mtd_return"
            render={(record) =>
              `${(((record.mtd_pnl + record.summary.pnl) * 100) / record.book_size).toFixed(2)}%`
            }
            textAlign="right"
          />

          {/* MTD优化超额收益 */}
          <FunctionField
            source="t_mtd_alpha"
            render={(record) =>
              `${(100 * (record.mtd_alpha + record.summary.alpha)).toFixed(2)}%`
            }
            textAlign="right"
          />

          {/* YTD回报 */}
          <FunctionField
            source="ytd_return"
            textAlign="right"
            render={(record) =>
              `${(((record.ytd_pnl + record.summary.pnl) * 100) / record.book_size).toFixed(2)}%`
            }
          />

          {/* YTD优化超额收益 */}
          <FunctionField
            source="t_ytd_alpha"
            sortable={permissions === "apm"}
            render={(record) =>
              `${(100 * (record.ytd_alpha + record.summary.alpha)).toFixed(2)}%`
            }
            textAlign="right"
          />

          {/* 回撤 */}
          <FunctionField
            source="drawdown"
            sortable={permissions === "apm"}
            render={(record) =>
              `${(100 * (record.itd_alpha - record.high_watermark)).toFixed(2)}%`
            }
            textAlign="right"
          />

          {/* 当日回报 */}
          {/*<FunctionField
            source="summary.pnl"
            render={(record) =>
              `${((record.summary.pnl * 100) / record.book_size).toFixed(2)}%`
            }
            textAlign="right"
          />*/}
          <FunctionField
            source="summary.pnl_percent"
            render={(record) =>
              `${record.summary.pnl_percent.toFixed(2)}%`
            }
            textAlign="right"
          />

          {/* 距上次登录天数 */}
          <NumberField source="days_idle" sortable={false} />

          {/* 最后交易时间 */}
          <FunctionField
            source="last_traded"
            render={(record) =>
              `${record.last_traded
                ? record.last_traded.slice(0, 16).replace("T", " ")
                : ""
              }`
            }
            textAlign="right"
          />
          <ArrayField source="managers" sortable={false}>
            <SingleFieldList>
              <TextField
                source="full_name"
                style={{
                  marginRight: 10,
                  borderBottom: "1px dashed #ff9100",
                  padding: "0 2px",
                }}
              />
            </SingleFieldList>
          </ArrayField>
          {permissions === "apm" && <NumberField source="urgency" />}
          {permissions === "apm" && <NumberField source="admin_rating" />}
          {permissions === "apm" && (
            <ReferenceArrayField
              onlyForDisplay
              sortable={false}
              reference="institutes"
              source="institutes"
            >
              <SingleFieldList>
                <TextField source="name" />
              </SingleFieldList>
            </ReferenceArrayField>
          )}
          {permissions === "apm" && <UpdateButton callback={setParamInputs} />}
        </MyDatagrid>
      </List>
    </>
  );
};

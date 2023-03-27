import {
  Button as MuiButton,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Tab as MuiTab,
  Typography,
  Tooltip,
} from "@material-ui/core";
import ReceiptIcon from "@material-ui/icons/Receipt";

import {withStyles} from "@material-ui/core/styles";
import * as PropTypes from "prop-types";
import React from "react";
import {
  Button,
  CardActions,
  DateField,
  FunctionField,
  GET_LIST,
  ListButton,
  NumberField,
  Show,
  showNotification,
  SimpleShowLayout,
  TextField,
  Labeled,
  withDataProvider,
  translate,
} from "react-admin";
import {Link} from "react-router-dom";
import {
  Position,
  PositionWithDetail,
  PerformancePeriod,
  Dividend,
} from "../../core/model";
import ManagerListField from "./ManagerListField";
import {TransField} from "../common";
import {fetchTicker} from "../../providers/api";
import {Create} from "@material-ui/icons";
import {HostPrefix} from "../../environment";

import './PortfolioShow.css'
import eventBus from "../../utils/event-bus";
import storage, {Storage} from "../../core/Storage";
import {getReduceStockContent} from "../../utils/reduce-stock";

const useStyles = {
  header: {
    // marginLeft: "-24px",
    // marginBottom: "-20px",
    fontSize: "1.2rem",
    marginRight: "15px",
  },
  field: {
    display: "inline-block",
    width: "20%",
    minWidth: "200px",
    whiteSpace: "nowrap",
  },
  longfield: {
    display: "inline-block",
    width: "78%",
    minWidth: "260px",
    whiteSpace: "nowrap",
  },
} as any;

const cardActionStyle = {
  zIndex: 2,
  display: "inline-block",
  float: "right",
};

const ShowActions = ({basePath, data, translate}: any) => {
  
  const openChartCsvDialog = () => {
    eventBus.emit('open-chart-csv', data)

    /*
    * <MuiButton
        color="primary"
        href={
          data ? `${HostPrefix}/export/csv/ZIDFQWER/${data.id}/performance` : "#"
        }
      >
    * */
  }
  
  return (
    <CardActions style={cardActionStyle}>
      <MuiButton
        color="primary"
        onClick={openChartCsvDialog}
      >
        <ReceiptIcon/>
        {translate("common.historical_return")}
      </MuiButton>

      <ListButton basePath={basePath}/>
    </CardActions>
  )
};

enum PosType {
  Open,
  Closed,
  Dvd,
}

const ColorIndicator = {positive: "#d81b60", negative: "#00897b"};


const DvdTable = ({
                    dvdList,
                    translate,
                  }: {
  dvdList: Dividend[];
  translate: any;
}) => (
  <Table padding="none">
    <TableHead>
      <TableRow>
        <TableCell>{translate("resources.order.fields.security")}</TableCell>
        <TableCell>{translate("resources.order.fields.ticker")}</TableCell>
        <TableCell>
          {translate("resources.positions.stock_dividend")}(
          {translate("resources.positions.per_share", {shares: 10})})
        </TableCell>
        <TableCell>{translate("resources.positions.dividend")}</TableCell>
        <TableCell>
          {translate("common.total")}{" "}
          {translate("resources.positions.dividend")}
        </TableCell>
        <TableCell>
          {translate("resources.positions.writes_offer")}(
          {translate("resources.positions.per_share", {shares: 10})})
        </TableCell>
        <TableCell>
          {translate("resources.positions.writes_offer")}
          {translate("common.price")}
        </TableCell>
        <TableCell>{translate("common.ex_dividend_time")}</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {dvdList.length > 0 ? (
        dvdList.map((dvd) => (
          <TableRow key={dvd.id}>
            <TableCell>
              <TextField record={dvd} source="name"/>
            </TableCell>
            <TableCell>
              <TextField record={dvd} source="ticker"/>
            </TableCell>
            <TableCell>
              {dvd.split_ratio !== 1 && (
                <TextField
                  record={{
                    ...dvd,
                    split: (dvd.split_ratio * 100 - 100) / 10,
                  }}
                  source="split"
                />
              )}
            </TableCell>
            <TableCell>
              {dvd.dividend && <TextField record={dvd} source="dividend"/>}
            </TableCell>
            <TableCell>
              {dvd.dividend && (
                <NumberField
                  record={dvd}
                  source="amount"
                  options={{maximumFractionDigits: 0}}
                />
              )}
            </TableCell>
            <TableCell>
              {dvd.rights_price && (
                <TextField
                  record={{
                    ...dvd,
                    rights: (dvd.rights_ratio * 100 - 100) / 10.0,
                  }}
                  source="rights"
                />
              )}
            </TableCell>
            <TableCell>
              {dvd.rights_price && (
                <NumberField record={dvd} source="rights_price"/>
              )}
            </TableCell>
            <TableCell>
              <TextField record={dvd} source="date"/>
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={8}>
            <Typography variant="caption" align="center">
              {translate("common.no_record")}
            </Typography>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
);

const CurrencyColor = {CNY: "inherit", HKD: "#b400ff", USD: "green"};

const PositionTable = ({
                         positions,
                         type,
                         status,
                         translate,
                         ...props
                       }: {
  positions: PositionWithDetail[];
  type: PosType;
  status: DataStatus;
  [other: string]: any;
}) => {
  const [reduceStockList, setReduceStockList] = useState([])

  useEffect(() => {
    const tmpList = window.location.hash.split('/')
    const portfolioId = tmpList[tmpList.length - 2]
    getReduceStockContent(Number(portfolioId)).then((res: any) => {
      storage.set(Storage.Keys.ReduceStockList, res)
      setReduceStockList(res)
    })
  }, [])

  const openReduceStockManagement = (pos: any) => {
    eventBus.emit('open-reduce-stock', {
      data: reduceStockList.filter((x: any) => x.ticker === pos.ticker),
      pos
    })
  }

  const hasReduceStock = (pos) => {
    if (reduceStockList.length) {
      return reduceStockList.some((v: any) => v.ticker === pos.ticker);
    } else {
      return false
    }
  }

  return (
    <Table padding="none" style={{minWidth: "1000px"}}>
      <TableHead>
        <TableRow>
          <TableCell>{translate("resources.order.fields.security")}</TableCell>
          <TableCell>{translate("resources.order.fields.ticker")}</TableCell>
          <TableCell>{translate("resources.order.fields.currency")}</TableCell>
          <TableCell>{translate("resources.order.fields.is_buy")}</TableCell>
          <TableCell>
            {translate("valueTrans.purpose.open")}
            {translate("common.time")}
          </TableCell>
          <TableCell numeric>
            {translate("valueTrans.purpose.open")}
            {translate("common.price")}
          </TableCell>
          {type === PosType.Open && (
            <TableCell numeric>
              {translate("resources.positions.notional")}
            </TableCell>
          )}
          {type === PosType.Open && (
            <TableCell numeric>{translate("common.mv")}</TableCell>
          )}
          {type === PosType.Open && (
            <TableCell numeric> {translate("common.avg_cost")}</TableCell>
          )}
          {type === PosType.Open && (
            <TableCell numeric>
              {translate("common.last")}
              {translate("common.price")}
            </TableCell>
          )}
          {type === PosType.Open && (
            <TableCell numeric>
              {translate("common.daily")}
              {translate("common.price_change")}
            </TableCell>
          )}
          {type === PosType.Open && (
            <TableCell numeric>
              {translate("common.monthly")}
              {translate("common.price_change")}
            </TableCell>
          )}
          {type === PosType.Open && (
            <TableCell numeric>
              {translate("common.since_open")}
              {translate("common.price_change")}
            </TableCell>
          )}
          {type === PosType.Open && (
            <TableCell numeric>
              {translate("common.daily")}
              {translate("common.pnl")}
            </TableCell>
          )}
          {type === PosType.Open && (
            <TableCell numeric>
              {translate("common.monthly")}
              {translate("common.pnl")}
            </TableCell>
          )}
          <TableCell numeric>
            {translate("common.total")}
            {translate("common.pnl")}
          </TableCell>
          {type === PosType.Closed && (
            <TableCell numeric>
              {translate("valueTrans.purpose.close")}
              {translate("common.time")}
            </TableCell>
          )}
          {type === PosType.Open && (
            <TableCell numeric align="center">自动减仓</TableCell>
          )}
          {type === PosType.Open && (
            <TableCell numeric>{translate("actions.name")}</TableCell>
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {positions && status === DataStatus.Normal && positions.length ? (
          positions.map((pos) => (
            <TableRow
              key={pos.id}
              style={{background: pos.latest.notional_unit === 0 ? "#eee" : ""}}
            >
              <TableCell>
                <Link
                  className="link"
                  to={{
                    pathname: `/order`,
                    search: `?position=${pos.id}`,
                  }}
                >
                  <TextField
                    color="primary"
                    record={pos}
                    source="security_name"
                  />
                </Link>
                {pos.notional_unit === 0 && (
                  <Tooltip title={translate("common.pending_vwap")}>
                    <span style={{color: "red"}}> *</span>
                  </Tooltip>
                )}
              </TableCell>
              <TableCell>
                <FunctionField
                  record={pos}
                  source="ticker"
                  render={(record) =>
                    record["ticker"].substring(record["region"] === "CH" ? 0 : 1)
                  }
                />
              </TableCell>
              <TableCell>
                <TextField
                  record={pos}
                  source="currency"
                  style={{color: CurrencyColor[pos["currency"]]}}
                />
              </TableCell>
              <TableCell align="center">
                <TransField
                  record={pos}
                  source="side"
                  transKey="valueTrans.positionSide"
                />
              </TableCell>
              <TableCell>
                <FunctionField
                  source="created"
                  record={pos}
                  render={(record) =>
                    `${record.created.slice(0, 16).replace("T", " ")}`
                  }
                />
              </TableCell>
              <TableCell numeric>
                <NumberField
                  record={pos}
                  source="initial_px"
                  options={{maximumFractionDigits: 2, minimumFractionDigits: 2}}
                  style={{color: CurrencyColor[pos["currency"]]}}
                />
              </TableCell>
              {type === PosType.Open && (
                <TableCell align="right" numeric>
                  <NumberField
                    record={{
                      ...pos,
                      actual_notional:
                        pos.latest.notional_unit * (2 * pos.side - 1),
                    }}
                    source="actual_notional"
                    style={{
                      textDecoration: pos.side === 0 ? "underline" : "none",
                    }}
                  />
                </TableCell>
              )}
              {type === PosType.Open && (
                <TableCell align="right" numeric>
                  <NumberField
                    record={pos}
                    source="current_mv"
                    options={{maximumFractionDigits: 0}}
                    style={{
                      textDecoration: pos.side === 0 ? "underline" : "none",
                      color: CurrencyColor[pos["currency"]],
                    }}
                  />
                </TableCell>
              )}
              {type === PosType.Open && (
                <TableCell align="right" numeric>
                  <NumberField
                    record={pos}
                    source="latest.avg_px"
                    options={{
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }}
                    style={{
                      display: "inline",
                      color: CurrencyColor[pos["currency"]],
                    }}
                  />
                  {pos.pending_vwap && (
                    <Tooltip title="有未完成的vwap订单，价格可能变化">
                      <span style={{color: "red"}}> *</span>
                    </Tooltip>
                  )}
                </TableCell>
              )}
              {type === PosType.Open && (
                <TableCell align="right" numeric>
                  <NumberField
                    record={pos}
                    source="tickerDetail.last"
                    options={{
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }}
                    style={{
                      display: "inline",
                      color: CurrencyColor[pos["currency"]],
                    }}
                  />
                </TableCell>
              )}
              {type === PosType.Open && (
                <TableCell align="right" numeric>
                  <NumberField
                    record={pos}
                    source="px_change_1d"
                    options={{style: "percent", maximumFractionDigits: 2}}
                    style={{
                      fontWeight: "bold",
                      color:
                        pos.px_change_1d === null
                          ? "inherit"
                          : pos.px_change_1d > 0
                            ? ColorIndicator.positive
                            : ColorIndicator.negative,
                    }}
                  />
                </TableCell>
              )}
              {type === PosType.Open && (
                <TableCell align="right" numeric>
                  <NumberField
                    record={pos}
                    source="monthly_change"
                    options={{style: "percent", maximumFractionDigits: 2}}
                    style={{
                      fontWeight: "bold",
                      color:
                        pos.monthly_change === null
                          ? "yellow"
                          : pos.monthly_change > 0
                            ? ColorIndicator.positive
                            : ColorIndicator.negative,
                    }}
                  />
                </TableCell>
              )}
              {type === PosType.Open && (
                <TableCell align="right" numeric>
                  <NumberField
                    record={pos}
                    source="price_change_since_position"
                    options={{style: "percent", maximumFractionDigits: 2}}
                    style={{
                      fontWeight: "bold",
                      color:
                        pos.price_change_since_position === null
                          ? "inherit"
                          : pos.price_change_since_position > 0
                            ? ColorIndicator.positive
                            : ColorIndicator.negative,
                    }}
                  />
                </TableCell>
              )}
              {type === PosType.Open && (
                <TableCell align="right" numeric>
                  <NumberField
                    record={pos}
                    source="latest.pnl"
                    options={{maximumFractionDigits: 0}}
                    style={{color: CurrencyColor[pos["currency"]]}}
                  />
                </TableCell>
              )}
              {type === PosType.Open && (
                <TableCell align="right" numeric>
                  <NumberField
                    record={{
                      ...pos,
                      monthly_pnl_total: pos.mtd_pnl + pos.latest.pnl,
                    }}
                    source="monthly_pnl_total"
                    options={{maximumFractionDigits: 0}}
                    style={{color: CurrencyColor[pos["currency"]]}}
                  />
                </TableCell>
              )}
              <TableCell align="right" numeric>
                <NumberField
                  record={{
                    ...pos,
                    total_pnl_total: pos.total_pnl + pos.latest.pnl,
                  }}
                  source="total_pnl_total"
                  options={{maximumFractionDigits: 0}}
                  style={{color: CurrencyColor[pos["currency"]]}}
                />
              </TableCell>
              {type === PosType.Closed && (
                <TableCell numeric>
                  <FunctionField
                    source="closed_at"
                    record={pos}
                    render={(record) =>
                      `${record.closed_at.slice(0, 16).replace("T", " ")}`
                    }
                  />
                </TableCell>
              )}
              {/* 管理自动减仓 */}
              {type === PosType.Open && (
                <TableCell align="center" numeric>
                  {
                    hasReduceStock(pos) ?
                      (
                        <div
                          style={{color: 'blue', cursor: "pointer"}}
                          onClick={() => openReduceStockManagement(pos)}
                        >
                          管理
                        </div>
                      )
                      : (<div style={{color: '#ccc'}}>----</div>)
                  }
                </TableCell>
              )}
              {/* 操作 */}
              {type === PosType.Open && (
                <TableCell numeric>
                  {pos.latest.notional_unit > 0 && (
                    <span>
                    <Link
                      className="link"
                      to={{
                        pathname: `/order/create`,
                        state: {
                          purpose: "add",
                          portfolio: pos.portfolio,
                          is_buy: pos.side === 1,
                          security: pos.security,
                          pos,
                        },
                      }}
                    >
                      {translate("valueTrans.purpose.add")}
                    </Link>{" "}
                      <Link
                        className="link"
                        to={{
                          pathname: `/order/create`,
                          state: {
                            purpose: "reduce",
                            portfolio: pos.portfolio,
                            is_buy: pos.side !== 1,
                            security: pos.security,
                            pos,
                          },
                        }}
                      >
                      {translate("valueTrans.purpose.reduce")}
                    </Link>{" "}
                      <Link
                        className="link"
                        to={{
                          pathname: `/order/create`,
                          state: {
                            purpose: "close",
                            portfolio: pos.portfolio,
                            is_buy: pos.side !== 1,
                            security: pos.security,
                            notional_unit: pos.latest.notional_unit,
                            pos,
                          },
                        }}
                      >
                      {translate("valueTrans.purpose.close")}
                    </Link>
                  </span>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))
        ) : positions && status === DataStatus.Normal && !positions.length ? (
          <TableRow>
            <TableCell colSpan={type === PosType.Open ? 15 : 7}>
              <Typography variant="caption" align="center">
                {translate("common.no_record")}
              </Typography>
            </TableCell>
          </TableRow>
        ) : (
          <TableRow>
            <TableCell colSpan={type === PosType.Open ? 15 : 7}>
              <Typography variant="caption" align="center">
                Loading...
              </Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
};

const {useEffect, useState} = React;

enum DataStatus {
  Init,
  Error,
  Normal,
}

const calcPosUpdate = (pos: PositionWithDetail) => {
  try {
    if (!pos.tickerDetail) {
      return {};
    }
    return {
      monthly_change: pos.tickerDetail.last / pos.monthly_start_px - 1,
      current_mv: pos.latest.qty * pos.tickerDetail.last * (pos.side * 2 - 1),
      px_change_1d: pos.tickerDetail.last / pos.tickerDetail.close - 1,
      price_change_since_position: pos.tickerDetail.last / pos.initial_px - 1,
    };
  } catch (e) {
    return {};
  }
};

let PositionList: any = withStyles(useStyles)(
  ({dataProvider, dispatch, record, classes, translate, ...props}: any) => {
    let [positions, setPositions] = useState<Position[]>([]);
    let [dataStatus, setStatus] = useState<DataStatus>(DataStatus.Init);
    let [tab, setTab] = useState<PosType>(PosType.Open);
    let [dvdList, setDvdList] = useState<Dividend[]>([]);
    let fetchDvd = true;

    const fetchPos = () => {
      dataProvider(GET_LIST, "positions", {
        pagination: {perPage: 99999, page: 1},
        sort: {field: "id", order: "ASC"},
        filter: {
          portfolio: record.id,
        },
      })
        .then((pos) => pos.data)
        .then((positions: Position[]) =>
          Promise.all(
            positions.map((pos) => fetchTicker(pos.ticker, pos.region))
          )
            // .then(tickers =>
            //   secs.map((sec, i) => ({ ...sec, tickerDetail: tickers[i] }))
            // )
            .then((tickers) =>
              positions
                .map(
                  (pos, i) =>
                    ({
                      ...pos,
                      tickerDetail: tickers[i],
                    } as PositionWithDetail)
                )
                .map((pos) => ({...pos, ...calcPosUpdate(pos as any)}))
                .sort(
                  (a: Position, b: Position) =>
                    b.latest.notional_unit * (2 * b.side - 1) -
                    a.latest.notional_unit * (2 * a.side - 1)
                )
            )
            .catch((err) => {
              console.error(err);
              dispatch(showNotification("Error: 更新实时数据失败", "warning"));
              return [];
            })
        )
        .then((pos) => {
          setPositions(pos);
          setStatus(DataStatus.Normal);

          if (fetchDvd) {
            dataProvider(GET_LIST, "dvd", {
              pagination: {perPage: 100, page: 1},
              sort: {field: "id", order: "ASC"},
              filter: {
                portfolio: record.id,
              },
            }).then((r) => {
              fetchDvd = false;
              const dvdList = r.data.map((dvd) => {
                const matched = pos.filter(
                  (position) => position.security === dvd.security
                );
                return {
                  ...dvd,
                  amount: dvd.dividend * matched[0].latest.qty,
                };
              });
              setDvdList(dvdList);
            });
          }
        })
        .catch((e) => {
          console.error(e);
          dispatch(showNotification("Error: Get positions error", "warning"));
          setStatus(DataStatus.Error);
        });
    };

    useEffect(() => {
      fetchPos();
      const id = setInterval(fetchPos, 30000);
      return () => clearInterval(id);
    }, []);
    return (
      <>
        <div style={{display: "flex", justifyContent: "space-between"}}>
          {/*<CardHeader classes={{ root: classes.header }} />*/}
          <Typography component={"span"} classes={{root: classes.header}}>
            {translate("resources.positions.name")}
          </Typography>

          <Button
            label={translate("valueTrans.purpose.open")}
            component={Link}
            to={{
              pathname: `/order/create`,
              state: {
                portfolio: record.id,
              },
            }}
          >
            <Create/>
          </Button>
        </div>

        <Tabs value={tab} onChange={(e, tab) => setTab(tab)}>
          <MuiTab
            value={PosType.Open}
            label={translate("resources.positions.fields.open")}
          />
          <MuiTab
            value={PosType.Closed}
            label={translate("resources.positions.fields.closed")}
          />
          <MuiTab value={PosType.Dvd} label={translate("common.dividend")}/>
        </Tabs>
        {tab === PosType.Open && (
          <PositionTable
            type={PosType.Open}
            positions={positions.filter((p) => !p.closed_at)}
            status={dataStatus}
            translate={translate}
            {...props}
          />
        )}
        {tab === PosType.Closed && (
          <PositionTable
            type={PosType.Closed}
            positions={positions.filter((p) => !!p.closed_at)}
            status={dataStatus}
            translate={translate}
            {...props}
          />
        )}
        {tab === PosType.Dvd && (
          <DvdTable dvdList={dvdList} translate={translate}/>
        )}
      </>
    );
  }
);

const Performance = withStyles(useStyles)(
  ({record, classes, translate}: any) => {
    const [period, setPeriod] = useState(PerformancePeriod.MTD);
    return (
      <>
        <div style={{display: "flex"}}>
          {/*<CardHeader classes={{ root: classes.header }} />*/}
          <Typography component={"span"} classes={{root: classes.header}}>
            {translate("resources.portfolio.portfolio_return")}
          </Typography>
          <span>
            {Object.values(PerformancePeriod).map((prd) => (
              <span
                key={prd}
                style={{
                  paddingBottom: "6px",
                  borderBottom: period === prd ? "1px solid #ffc107" : "none",
                }}
              >
                <MuiButton
                  size="small"
                  color={period === prd ? "primary" : "default"}
                  onClick={() => setPeriod(prd)}
                >
                  {translate("common." + prd)}
                </MuiButton>
              </span>
            ))}
          </span>
        </div>

        <div className={classes.field}>
          <Labeled label="resources.portfolio.fields.gross_pnl">
            <NumberField
              record={record}
              source={`performance.${period}.gross_pnl`}
              options={{maximumFractionDigits: 0}}
              className={classes.field}
            />
          </Labeled>
        </div>

        <div className={classes.field}>
          <Labeled label="resources.portfolio.fields.net_pnl">
            <NumberField
              record={record}
              source={`performance.${period}.total_pnl`}
              options={{maximumFractionDigits: 0}}
              className={classes.field}
            />
          </Labeled>
        </div>

        <div className={classes.field}>
          <Labeled label="resources.portfolio.fields.gross_return">
            <NumberField
              record={record}
              source={`performance.${period}.gross_return`}
              options={{style: "percent", maximumFractionDigits: 2}}
              className={classes.field}
            />
          </Labeled>
        </div>

        <div className={classes.field}>
          <Labeled label="resources.portfolio.fields.net_return">
            <NumberField
              record={record}
              source={`performance.${period}.net_return`}
              options={{style: "percent", maximumFractionDigits: 2}}
              className={classes.field}
            />
          </Labeled>
        </div>

        <div className={classes.field}>
          <Labeled source="alpha" label="resources.portfolio.fields.alpha">
            <NumberField
              color="secondary"
              record={record}
              source={`performance.${period}.alpha`}
              options={{style: "percent", maximumFractionDigits: 2}}
              style={{fontWeight: "bold"}}
            />
          </Labeled>
        </div>
      </>
    );
  }
);

(PositionList as any).propTypes = {
  dataProvider: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  push: PropTypes.func,
  record: PropTypes.object,
  showNotification: PropTypes.func,
  translate: PropTypes.func,
};

PositionList = withDataProvider(PositionList);

export const PortfolioShow = translate(
  withStyles(useStyles)(
    ({classes, record, permissions, translate, ...props}: any) => {
      const date = new Date();
      const formatter = new Intl.NumberFormat();
      return (
        <div>
          <Show
            title="resources.portfolio.detail"
            actions={<ShowActions translate={translate} {...props} />}
            {...props}
          >
            <SimpleShowLayout>

              <ManagerListField
                source="managers"
                onlyForDisplay={permissions === "vpm"}
              />

              <Divider/>

              <TextField source="name" className={classes.field}/>

              <NumberField source="book_size" className={classes.field}/>

              <FunctionField
                source="cash"
                className={classes.field}
                render={(record) =>
                  formatter.format(record.book_size - record.invested_size)
                }
              />
              <FunctionField
                source="last_traded"
                className={classes.field}
                render={(record) =>
                  `${
                    record.last_traded
                      ? record.last_traded.slice(0, 16).replace("T", " ")
                      : ""
                  }`
                }
              />
              <DateField source="created" className={classes.field}/>

              <Divider style={{marginBottom: "20px"}}/>

              <Typography classes={{root: classes.header}}>
                {translate("resources.portfolio.stats")}
              </Typography>

              <FunctionField
                source="current_position"
                render={(record) =>
                  `${
                    record.summary
                      ? (
                        (record.summary.market_cap * 100) /
                        record.book_size
                      ).toFixed(2)
                      : 0
                  }%`
                }
                className={classes.field}
              />
              <NumberField
                source="summary.market_exposure"
                className={classes.field}
                options={{style: "percent", maximumFractionDigits: 2}}
              />
              <NumberField
                source="stats.mtd_turnover"
                className={classes.field}
                options={{style: "percent", maximumFractionDigits: 2}}
              />
              <FunctionField
                source="stats.cost_on_book"
                className={classes.field}
                render={(record) =>
                  record.stats
                    ? `${Math.round(record.stats.total_cost)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} / ${(
                      (record.stats.total_cost * 100) /
                      record.book_size
                    ).toPrecision(2)}%`
                    : "0 / 0%"
                }
              />
              <NumberField
                source="stats.benchmark"
                className={classes.field}
                options={{style: "percent", maximumFractionDigits: 2}}
              />
              {/*<NumberField source="realized_pnl" className={classes.field} />*/}
              <Divider style={{marginBottom: "20px"}}/>
              <Performance record={record} translate={translate}/>
              <Divider style={{marginBottom: "20px"}}/>
              <PositionList record={record} translate={translate}/>
            </SimpleShowLayout>
          </Show>
          <div style={{marginTop: 20, fontSize: "12px", color: "gray"}}>
            {translate("common.datetime")}: {date.getFullYear()}-
            {date.getMonth() + 1}-{date.getDate()}
          </div>
        </div>
      );
    }
  )
);

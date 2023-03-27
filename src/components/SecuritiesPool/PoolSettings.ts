import { ColDef } from "../common";

export const detailColumns: ColDef[] = [
  { field: "created", label: "common.created" },
  { field: "user", textLabel: "Uid" },
  { field: "spot_px" },
  {
    field: "params_leading_position",
    valueTrans: true,
  },
  {
    field: "params_upside",
    valueTrans: true,
  },
  {
    field: "params_downside_risk",
    valueTrans: true,
  },
  {
    field: "params_revenue_growth_rate",
  },
  {
    field: "params_profit_growth_rate",
  },
];

export const userColumns: ColDef[] = [
  { field: "ticker", label: "resources.order.fields.ticker" },
  { field: "security_name" },
  { field: "created", label: "common.created" },
  { field: "spot_px" },
  {
    field: "params_leading_position",
    valueTrans: true,
  },
  {
    field: "params_upside",
    valueTrans: true,
  },
  {
    field: "params_downside_risk",
    valueTrans: true,
  },
  {
    field: "params_revenue_growth_rate",
  },
  {
    field: "params_profit_growth_rate",
  },
];

export const securityListColumns: ColDef[] = [
  {
    field: "security",
    hidden: true,
  },
  {
    field: "ticker",
    label: "resources.order.fields.ticker",
    link: (val: string | number) => `/order/?ticker=${val}`,
  },
  {
    field: "security_name",
  },
  {
    field: "count",
  },
];

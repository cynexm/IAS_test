type ForeignKey<T, K = "id"> = string;
type Date = string;
type DateTime = string;
type Float = number;
type Integer = number;

export type FxRate = {
  CNY: {
    HKD: 0.908;
  };
  USD: {
    HKD: 7.85;
    CNY: 7.01;
  };
};
export type User = {
  email: "";
  id: 5;
  is_staff: false;
  is_superuser: false;
  last_login: null;
  username: "emily";
  first_name: "emily";
  last_name: "smith";
};
export type FundManager = {
  user: number;
  id: number;
  is_admin: boolean;
  username: string;
};

export enum PerformancePeriod {
  MTD = "mtd",
  QTD = "qtd",
  YTD = "ytd"
}
export type Portfolio = {
  id: number;
  name: string; // max_length=30
  description: string;
  book_size_unit: Integer; // default 0;
  book_size: Integer; // default 0;
  invested_unit: Integer; // default 0;
  locked_unit: Integer; // default 0;
  cash: Float;
  last_traded: DateTime;
  performance: { [period: string]: PortfolioPerformance };
  managers: FundManager[];
  created: DateTime; // auto_now_add=True
  is_active: boolean; // default=True,
  order_limit: Integer;
};

export type PortfolioPerformance = {
  avg_exposure: 0.1111111111111111;
  avg_notional: 1666666.6666666667;
  current_market_exposure: 1;
  return_on_book_size: -0.04;
  return_on_investment_size: -0.85;
  return_risk_adjusted: -0.85;
  total_pnl: -89201.48;
  realized_pnl: 0.01;
};

export type SecurityTypeOption = "stock" | "index_future";
export type SecurityTypeValue = 1 | 2;
export const SecurityType: Record<SecurityTypeOption, SecurityTypeValue> = {
  stock: 1,
  index_future: 2
};
export const Currency = {
  "Chinese Yuan": "CNY",
  "Hong Kong Dollar": "HKD",
  "United States Dollar": "USD"
};
export type CurrencyOption = "USD" | "CNY" | "HKD";
export type Security = {
  id: number; //
  blp_ticker: string | undefined; //
  ticker: string; //
  name: string; // max_length=30
  security_type: SecurityTypeValue; // default 1;
  currency: CurrencyOption;
  created: DateTime; // auto_now_add=True
  is_active: boolean; // default=True
  region: string;
};
export type SecurityWithDetail = Security & {
  tickerDetail: RawTickerData | undefined; // max_length=20
};

export type PortfolioSummary = {
  portfolio: ForeignKey<Portfolio>;
  date: Date;
  market_cap: number;
};
export type Institute = {
  name: string;
};
export type PortfolioManager = {
  portfolio: ForeignKey<Portfolio>;
  user: ForeignKey<User, "portfolios">;
  is_admin: boolean; // default=True
  created_by: ForeignKey<Portfolio, "managers_created">;
  created: string; // auto_now_add=True
  is_active: boolean; // default=True
};

export type OrderStatusOption = "pending" | "approved" | "closed";
export type OrderVerboseStatusValue =
  | "filled"
  | "pending fill"
  | "closed"
  | "pending approval";
export type OrderStatusValue = 0 | 1 | 2;
export const OrderStatus: Record<OrderStatusOption, OrderStatusValue> = {
  pending: 0,
  approved: 1,
  closed: 2
};
export type ExecutionTypeOption = "vwap_to_end" | "vwap_2day";
export type ExecutionTypeValue = 1 | 2;
export const ExecutionType: Record<ExecutionTypeOption, ExecutionTypeValue> = {
  vwap_to_end: 1,
  vwap_2day: 2
};
export type VirtualOrder = {
  portfolio: ForeignKey<Portfolio>;
  security: ForeignKey<Security>;
  status: OrderStatusValue; // default 0;
  verbose_status: OrderVerboseStatusValue;
  confirmed: boolean; // default=False
  is_buy: boolean;
  is_increase: boolean;
  notional_unit: number;
  approved_notional_unit: number;
  base_notional: number;
  currency: string; // max_length=5
  execution_type: ExecutionTypeValue; // default=1, choices=((1, 'vwap_to_end'), (2, 'vwap_2day'))
  start_time: string;
  end_time: string;
  user: ForeignKey<User>;
  reason_txt: string;
  reason_audio: string; // max_length=50
  created: string; // auto_now_add=True
  last_modified: string;
  is_active: boolean; // default=True
};

export type PositionSideOption = "short" | "long";
export type PositionSideValue = 0 | 1;
export const PositionSide: Record<PositionSideOption, PositionSideValue> = {
  long: 0,
  short: 1
};

export type Position = {
  id: number;
  portfolio: ForeignKey<Portfolio>;
  security: ForeignKey<Security>;
  ticker: string;
  region: string;
  hasReduceStock?: boolean;
  reduceStockList: any[];
  security_name: string;
  closed_at: Date | null;
  side: PositionSideValue;
  initial_px: number;
  initial_notional_unit: number;
  created: Date;
  notional_unit: number;
  latest: {
    position_pnl: number;
    trading_pnl: number;
    avg_px: number;
    tmp_avg_px: number;
    tmp_qty: number;
    notional_unit: number;
    qty: number;
    dividend: number;
    pnl: number;
  };
  mtd_pnl: number;
  total_pnl: number;
  pending_vwap: boolean;
  monthly_start_px: number;
};
export type Dividend = {
  id: number;
  security: ForeignKey<Security>;
  name: string;
  ticker: string;
  dividend: number;
  date: Date;
  amount: number;
  rights_ratio: number;
  rights_price: number;
  split_ratio: number;
};
export type PositionWithDetail = Position & {
  tickerDetail: RawTickerData | undefined; // max_length=20
  px_change_1d: number | null;
  price_change_since_position: number | null;
  current_mv: number | null;
  monthly_change: number | null;
};

type OneToOneField<T> = ForeignKey<T>;
export type ExecutionStatusOption = "pending fill" | "filled";
export type ExecutionStatusValue = 0 | 1;
export const ExecutionStatus: Record<
  ExecutionStatusOption,
  ExecutionStatusValue
> = {
  "pending fill": 0,
  filled: 1
};
export type OrderExecution = {
  order: OneToOneField<VirtualOrder>;
  status: ExecutionStatusValue; // default 0;
  avg_price: number;
  qty: number;
  user: ForeignKey<User>;
  position: ForeignKey<Position>;
  notional: number;
  base_notional: number;
  created: string; // auto_now_add=True
  is_active: boolean; // default=True
};

export type TradeRule = { name: "rule7"; func: "rule_check7"; description: "" };
export type RawTickerData = {
  high: 6.55;
  last: 6.44;
  low: 6.39;
  open: 6.55;
  close: 13.5;
  time: "2019/10/15 12:48:48";
  volume: 1931670.0;
};
export type TickerData = {
  name: string;
  ticker: string;
} & RawTickerData;
// export type TickerData = {
//   name: string;
//   ticker: string;
//   date: string;
//   open: number;
//   close: number;
//   high: number;
//   low: number;
//   latest: number;
//   vol: number;
//   currency: string;
//   change: number;
//   changeRate: number;
// };

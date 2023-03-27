import {getAllPortfolios, getAllUsers} from "./providers/api";

type CreateReactEnv = typeof process.env & {
  REACT_APP_ISA_ROLE: "apm" | "vpm" | "all";
};

const env = process.env as CreateReactEnv;

export enum Isa_Role {
  Apm = "apm",
  Vpm = "vpm",
  All = "all"
}

export enum Pages {
  PortfolioSummary = "0",
  PositionSummary = "1",
  PortfolioManagement = "2",
  UserManagement = "3",
  Order = "4",
  FullView = "5",
  TradeMonitor = "6",
  TradeRule = "7",
  Security = "8",
  Institute = "9",
  PortfolioSimpleList = "10",
  SecuritiesPool = "11"
}

export const PrivilegeSet = {
  [Isa_Role.All]: [
    Pages.PositionSummary,
    Pages.PortfolioSummary,
    Pages.PortfolioManagement,
    Pages.UserManagement,
    Pages.Order,
    Pages.TradeMonitor,
    Pages.TradeRule,
    Pages.Security,
    Pages.Institute,
    Pages.PortfolioSimpleList
  ],
  [Isa_Role.Apm]: [
    Pages.PortfolioSummary,
    Pages.PortfolioManagement,
    Pages.UserManagement,
    Pages.Order,
    Pages.TradeMonitor,
    Pages.TradeRule,
    Pages.Security,
    Pages.Institute,
    Pages.PortfolioSimpleList
  ],
  [Isa_Role.Vpm]: [
    Pages.PortfolioSummary,
    Pages.PositionSummary,
    Pages.PortfolioManagement,
    Pages.UserManagement,
    Pages.Order,
    Pages.Security,
    Pages.Institute,
    Pages.PortfolioSimpleList
  ]
};

const envHost = {
  prod: "https://www.zxtdias.cn",
  test: "https://www.zxtdias.cn",
  dev: "https://www.zxtdias.cn"
};

export const HostPrefix =
  env.NODE_ENV === "production" ? envHost.prod : envHost.dev;

export const ApiPrefix = "/api/v1";
export const ApiPrefixV2 = "/api/v2";

export const EnvConfig = {
  Apis: {
    login: `${HostPrefix}/token-auth/`,
    stockSearch: (query: string) =>
      `${HostPrefix}${ApiPrefix}/stocks/search?query=${query}`,
    tradingRules: `${HostPrefix}${ApiPrefix}/trade_rules`,
    fxRate: `${HostPrefix}${ApiPrefix}/fx`,
    tickerEntry: (stock: number | string, region: number | string) =>
      `${HostPrefix}${ApiPrefix}/ticker/${stock}?region=${region}`,
    maxVol: (sec: number, portfolio: number) =>
      `${HostPrefix}${ApiPrefix}/portfolio/${portfolio}/cal_max_notional/?security=${sec}`,
    ruleCheck: (orderID: number | string) =>
      `${HostPrefix}${ApiPrefix}/order/${orderID}/check/`,
    stockEntry: (stock: number | string) =>
      `${HostPrefix}${ApiPrefix}/securities/${stock}`,
    ruleofthree: (query: string) =>
      `${HostPrefix}${ApiPrefix}/ruleofthree/?${query}`,

    // 自动减仓查询
    lightenUpCheck: (portfolioId: number) =>
      `${HostPrefix}${ApiPrefix}/decay/?portfolio_id=${portfolioId}`,

    // 组合 ID
    getCombinationID: () =>
      `${HostPrefix}${ApiPrefix}/portfolio/?internal=true&limit=50&offset=0&ordering=-id`,

    // 减仓管理 URL
    reduceStockManagement: () => `${HostPrefix}${ApiPrefix}/decay/`,

    // 查询证券类型 URL
    getSecurityType: ticker =>
      `${HostPrefix}${ApiPrefixV2}/security?ticker=${ticker}`,

    // 查询月度回报
    getMonthReport: portfolioId =>
      `${HostPrefix}${ApiPrefix}/monthreport?portfolio_id=${portfolioId}`,

    // 获取所有用户
    getAllUsers: () =>
      `${HostPrefix}${ApiPrefix}/allusers`,

    // 获取所有用户
    getAllPortfolios: () =>
      `${HostPrefix}${ApiPrefix}/allportfolios`
  }
};

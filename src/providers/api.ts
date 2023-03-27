import { fetchUtils } from "react-admin";
import { Auth } from "../core/Auth";
import { FxRate, Security, RawTickerData } from "../core/model";
import storage, { Storage } from "../core/Storage";
import { EnvConfig } from "../environment";

export async function fetchApi<R = any>(
  url: string,
  withToken = true,
  method = "GET",
  payload?: any
): Promise<R> {
  let headers = new Headers();
  if (withToken) {
    headers.set(
      "Authorization",
      "Token " + (storage.get(Storage.Keys.AuthToken) || "")
    );
  }

  return fetchUtils
    .fetchJson(url, {
      headers,
      method,
      body: ["get", "options"].includes(method.toString().toLowerCase())
        ? undefined
        : JSON.stringify(payload)
    } as RequestInit)
    .then(res => res.json);
}

export async function login(username: string, password: string) {
  const payload = { username, password };
  return fetchApi<Auth>(EnvConfig.Apis.login, false, "POST", payload);
}

export async function fetchTradingRules() {
  console.debug("fetchTradingRules");
  return fetchApi(EnvConfig.Apis.tradingRules);
}

export const getRuleOfThreeData = async (query: string) => {
  fetchApi<any>(EnvConfig.Apis.ruleofthree(query));
};

const stockCache = {};

export async function fetchStock(stockPk: number, force = false) {
  if (!force && stockCache[stockPk]) {
    return Promise.resolve(stockCache[stockPk]);
  }
  console.debug("fetchStock: ", stockPk);
  return fetchApi<Security>(EnvConfig.Apis.stockEntry(stockPk)).then(res => {
    stockCache[res.id] = res;
    return res;
  });
}

export async function fetchTicker(ticker: string, region: string) {
  return fetchApi<RawTickerData>(
    EnvConfig.Apis.tickerEntry(encodeURI(ticker.toString()), region)
  ).catch(err => console.error("Fetch Ticker Data Error: ", err));
}

export async function fetchRuleCheck(orderID: string) {
  return fetchApi<boolean[]>(
    EnvConfig.Apis.ruleCheck(encodeURI(orderID.toString()))
  );
}

let fxRate: FxRate | undefined;

export async function fetchFxRate(force = false) {
  if (!force && fxRate) {
    return Promise.resolve(fxRate);
  }
  console.debug("fetchFxRate");
  return fetchApi<FxRate>(EnvConfig.Apis.fxRate).then(res => {
    fxRate = res;
    return res;
  });
}

export const drfHttpClient = (url: string, options: RequestInit) => {
  for (
    let token = storage.get(Storage.Keys.AuthToken), count = 1;
    token && count++ === 1;

  ) {
    let headers: Headers = new Headers(options.headers);
    headers.set("Authorization", "Token " + token);
    options.headers = headers;
    console.debug("DRF: ", url);
  }
  return fetchUtils.fetchJson(url, options);
};

// 自动减仓查询
export async function lightenUpCheck(portfolioId) {
  return fetchApi<any>(EnvConfig.Apis.lightenUpCheck(portfolioId));
}

// 获取初始第一个组合 ID
export async function getCombinationID() {
  return fetchApi<any>(EnvConfig.Apis.getCombinationID());
}

// 减仓管理
export async function reduceStockManagement(
  position_id: string,
  mngtype: number = 1
) {
  return fetchApi<any>(EnvConfig.Apis.reduceStockManagement(), true, "POST", {
    position_id, // 持仓 ID
    mngtype // 1 恢复原来仓位 | 2 维持当前仓位
  });
}

// 查询证券类型
export async function getSecurityType(ticker: number) {
  return fetchApi<any>(
    EnvConfig.Apis.getSecurityType(ticker), // 股票代码
    true,
    "GET"
  );
}

// 查询月度回报
export async function getMonthReport(portfolioId: number) {
  return fetchApi<any>(
    EnvConfig.Apis.getMonthReport(portfolioId), // 组合 ID
    true,
    "GET"
  );
}

export async function getAllUsers() {
  return fetchApi<any>(
    EnvConfig.Apis.getAllUsers(),
    true,
    "GET"
  );
}

export async function getAllPortfolios() {
  return fetchApi<any>(
    EnvConfig.Apis.getAllPortfolios(),
    true,
    "GET"
  );
}

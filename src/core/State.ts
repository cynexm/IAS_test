import { TradeRule } from "./model";

export type AppState = {
  tradeRules: TradeRule[];
  [other: string]: any;
};

import { Action } from "redux";
import { call, put, takeEvery } from "redux-saga/effects";
import { fetchTradingRules } from "../providers/api";
import { TradeRule } from "./model";
// Actions
export enum TradingRulesActions {
  TradingRulesUpdate = "[TradingRulesActions] TradingRulesUpdate",
  TradingRulesUpdateSuccess = "[TradingRulesActions] TradingRulesUpdateSuccess"
}

export class TradingRulesUpdateAction implements Action {
  readonly type = TradingRulesActions.TradingRulesUpdate;
}

export class TradingRulesUpdateSuccessAction implements Action {
  readonly type = TradingRulesActions.TradingRulesUpdateSuccess;
  constructor(public payload: any) {}
}

export const updateTradingRules = () => ({
  ...new TradingRulesUpdateAction()
});
export const updateTradingRulesSuccess = (rules: TradeRule[]) => ({
  ...new TradingRulesUpdateSuccessAction(rules)
});

// Sagas
export function* fetchRules() {
  let rules = yield call(fetchTradingRules);
  yield put(updateTradingRulesSuccess(rules));
}
export function* updateRules() {
  yield takeEvery(TradingRulesActions.TradingRulesUpdate, fetchRules);
}

// Reducers
export const tradingRulesReducer = (previousState = [], { type, payload }) => {
  if (type === TradingRulesActions.TradingRulesUpdateSuccess) {
    return payload;
  }
  return previousState;
};

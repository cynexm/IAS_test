import { Card, CardContent, CardHeader, Icon } from "@material-ui/core";
import React from "react";
import { Title } from "react-admin";
import { connect } from "react-redux";
import { AppState } from "../core/State";
import { updateTradingRules } from "../core/TradingRules";

import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { TradeRule } from "../core/model";
import { fetchRuleCheck } from "../providers/api";
import { Check, Close } from "@material-ui/icons";
import { OrderList } from "../components/Order/OrderList";

export const TradeMonitor = () => <OrderList></OrderList>;

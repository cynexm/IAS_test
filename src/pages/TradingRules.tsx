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

const useStyles = createStyles((theme: Theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3 + "px",
    overflowX: "auto"
  },
  table: {
    minWidth: 650
  }
})) as any;

const { useEffect, useState } = React;
export const TradingRules = connect(
  (state: AppState) => ({ rules: state.tradeRules }),
  { fetchRules: updateTradingRules }
)(
  withStyles(useStyles)(
    ({
      rules,
      fetchRules,
      classes,
      id,
      ...props
    }: {
      rules: TradeRule[];
      fetchRules;
      classes;
      id;
    }) => {
      const [result, setResult] = useState<boolean[]>([]);
      useEffect(() => {
        fetchRules();
        fetchRuleCheck(id).then(result => setResult(result));
      }, [id]);
      console.debug("Rules: ", props);
      return (
        // <Card>
        //   <Title title="Trade Rules"></Title>
        //   <CardHeader title="Trade Rules"></CardHeader>
        //   <CardContent>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Result</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rules.map((row, i) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell>{row.description || "-"}</TableCell>
                <TableCell align="right">
                  {result[i] ? (
                    <Icon color="primary">
                      <Check></Check>
                    </Icon>
                  ) : (
                    <Icon>
                      <Close></Close>
                    </Icon>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        //   </CardContent>
        // </Card>
      );
    }
  )
);

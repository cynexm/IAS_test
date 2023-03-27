import React, { useState, useEffect } from "react";
import {
  Card,
  createStyles,
  Grid,
  Typography,
  withStyles,
} from "@material-ui/core";
import { CardProps } from "@material-ui/core/Card";
import { green, red, amber } from "@material-ui/core/colors";
import { TickerData, Security } from "../../core/model";
import { fetchTicker } from "../../providers/api";
import { abbrNum } from "../../utils/num";
import { translate } from "react-admin";

type TickerPanelProps = {
  security?: Security;
  noDataTransparent?: boolean;
  cardProps?: CardProps;
};

const styles = createStyles({
  wrapper: {
    transition: "all 0.3s",
    maxWidth: "700px",
    padding: "15px",
    margin: "15px 0px",
    background: amber[50],
    borderBottom: "2px dashed gray",
    borderRadius: 0,
  },
});

const REGIONS = { HKD: "HK", CNY: "CH" };

export const TickerPanel = translate(
  withStyles(styles)(
    ({
      security,
      cardProps,
      classes,
      translate,
      noDataTransparent = true,
    }: any) => {
      const [data, setData] = useState<null | TickerData>(null);
      useEffect(() => {
        setData(null);
        if (security) {
          security.region = security.region || REGIONS[security.currency];
          fetchTicker(security.ticker, security.region)
            .then((d) =>
              setData({
                name: security.name,
                ticker: security.ticker,
                ...d,
              } as TickerData)
            )
            .catch((err) => console.error(err));
        }
      }, [security]);
      return (
        <Card
          elevation={0}
          style={{ opacity: !data && noDataTransparent ? 0 : 1 }}
          className={classes.wrapper}
          {...cardProps}
        >
          <Grid container direction="row" justify="flex-start" spacing={8}>
            <Grid item xs>
              <Typography variant="headline">
                {(data && data.name) || "-"}
              </Typography>
              <Typography variant="subheading">
                {(data && data.ticker) || "-"}
              </Typography>
            </Grid>
            <Grid item container xs justify="space-between" wrap="wrap">
              <Grid container justify="space-between">
                <Typography
                  variant="headline"
                  style={{
                    width: "100%",
                    color:
                      data && data.last >= data.open ? red[400] : green[400],
                  }}
                >
                  {data && data.last.toFixed(2)}
                </Typography>
                <Typography variant="subheading">
                  {(security && security.currency) || "-"}
                </Typography>
              </Grid>
              {/* <Grid container justify="space-between">
              <Typography
                variant="subtitle1"
                style={{
                  color: data && data.change >= 0 ? red[400] : green[400]
                }}
              >
                {data && data.change >= 0 ? "+" : "-"}
                {data && data.change}
              </Typography>
              <Typography
                variant="subtitle1"
                style={{
                  color: data && data.change >= 0 ? red[400] : green[400]
                }}
              >
                {data && data.change >= 0 ? "+" : "-"}
                {data &&
                  Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(
                    data.changeRate * 100
                  ) + "%"}
              </Typography>
            </Grid> */}
            </Grid>
            <Grid item container xs direction="column" justify="space-between">
              <Grid container justify="space-between">
                <Typography variant="subheading">
                  {translate("common.high")}:
                </Typography>
                <Typography variant="subheading" style={{ color: red[400] }}>
                  {data && data.high.toFixed(2)}
                </Typography>
              </Grid>
              <Grid container justify="space-between">
                <Typography variant="subheading">
                  {translate("common.low")}:
                </Typography>
                <Typography variant="subheading" style={{ color: green[400] }}>
                  {data && data.low.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
            <Grid item container xs direction="column" justify="space-between">
              <Grid container justify="space-between">
                <Typography variant="subheading">
                  {translate("common.open")}:
                </Typography>
                <Typography variant="subheading">
                  {data && data.open.toFixed(2)}
                </Typography>
              </Grid>
              <Grid container justify="space-between" wrap="nowrap">
                <Typography variant="subheading">
                  {translate("common.volume")}:
                </Typography>
                <Typography
                  variant="subheading"
                  style={{ whiteSpace: "nowrap" }}
                >
                  {data && data.volume && abbrNum(data.volume)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      );
    }
  )
);

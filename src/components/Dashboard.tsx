import { Paper, Grid, Typography } from "@material-ui/core";
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Title } from "react-admin";

const styles = theme => ({
  container: {
    width: "65%",
    minWidth: 800
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginTop: 30
  },
  title: {
    fontSize: "1.2rem",
    borderBottom: "1px solid #ff9100"
  }
});

export const DashboardPage = props => {
  const { classes } = props;
  return (
    <div className={classes.container}>
      <Title title="common.guide" />
      <Paper className={classes.root} elevation={1}>
        <Typography className={classes.title} component="h4">
          IAS系统交易规则
        </Typography>

        <Typography component="div">
          <ol>
            <li>
              单笔最小交易量为500万人民币一手，每笔交易都为500万或500万的倍数
            </li>
            <li>
              单笔每日最大交易量由三个因素决定：
              <ol type="I">
                <li>交易标的的近期流动性</li>
                <li>选择交易执行的速度</li>
                <li>模拟组合对单一仓位的集中度限制</li>
              </ol>
            </li>
            <li>
              每笔交易都会有系统对允许交易量的自动提示，请注意：
              <ol type="I">
                <li>您可以根据提示进行交易，或</li>
                <li>
                  您不同意系统限制的交易量，可随时联系我们，相关交易规则可根据市场实际情况进行合理的调整
                </li>
              </ol>
            </li>
            <li>
              所有交易均需要提供交易理由，交易理由可以是文字输入或语音录入。请确保文字输入和语音录入逻辑清晰和叙述完整：
              <ol type="I">
                <li>建仓交易的理由需要充分，完整；</li>
                <li>
                  调仓和平仓交易不要求全新的交易理由，“加仓”，“减仓”，“获利”，“止损”即可
                </li>
              </ol>
            </li>
            <li>
              交易综合成本由系统的交易模型测算，交易综合成本包含：
              <ol type="I">
                <li>交易佣金</li>
                <li>市场冲击成本</li>
                <li>其他交易成本</li>
              </ol>
              交易综合成本的波动取决于三个因素：
              <ol type="I">
                <li>交易标的的当日流动性</li>
                <li>单笔交易的规模</li>
                <li>
                  交易执行的速度：市价订单（Touch）会因为市场冲击产生较均价订单（VWAP）更高的交易成本
                </li>
              </ol>
            </li>
          </ol>
        </Typography>
      </Paper>

      <Paper className={classes.root} elevation={1}>
        <Typography className={classes.title} component="h4">
          IAS系统组合回报计算
        </Typography>
        <Typography component="div">
          <ol>
            <li>A股多头组合根据组合类型对标不同的市场或申万行业指数</li>
            <li>
              组合“优化超额收益”综合计算组合投资仓位和现金仓位相对指数的alpha表现
            </li>
            <li>
              组合“净收益”计算组合绝对收益并扣除掉交易成本，对组合设定规模的回报
            </li>
            <li>组合“毛收益”计算组合绝对收益并不扣除交易成本</li>
            <li>组合交易成本包含：交易佣金，印花税，市场摩擦成本等</li>
            <li>组合风险敞口显示多空组合的交易偏向</li>
            <li>组合换手率显示当月总交易量除以组合管理规模的比例</li>
            <li>组合实际仓位显示实际持仓按当前市值初一组合管理规模的比例</li>
            <li>当月指数回报显示对标指数当月的百分比变动</li>
          </ol>
        </Typography>
      </Paper>
    </div>
  );
};

DashboardPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DashboardPage);

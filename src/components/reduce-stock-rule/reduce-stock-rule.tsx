import React from "react";
import "./reduce-stock-rule.css";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const ReduceStockRule = () => {
  return (
    <div className="reduce-stock-rule">
      <ExpansionPanel defaultExpanded={true}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>自动减仓规则</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            1. 过去45个交易日没有交易动作的仓位会开始自动减仓
            <br />
            2.
            每周会自动减仓5M（500万）仓位，并持续四周。如果仓位在第四周还多于5M（500万），会一次性清仓
            <br />
            3.
            组合管理人可以在自动减仓开始后通过系统随时干预被自动减仓的股票，包括：
            <br />
            1）终止自动减仓并恢复最近一周已减仓的仓位
            <br />
            2）终止自动减仓但维持现有仓位
            <br />
            3）在该仓位上进行其他交易
            <br />
            4.
            自动减仓生成的交易不产生交易费用和成本，恢复仓位也不会产生交易费用和成本
            <br />
            5. 关于自动减仓的相关问题请联系知行通达：caojiyun@zxtdam.com
            <br />
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

export default ReduceStockRule;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import "./reduce-stock-dialog.css";
import { getTimestamp, getYyyyMmDd } from "../../utils/common-utils";
import { abbrNum } from "../../utils/num";
import { reduceStockManagement } from "../../providers/api";
import Snackbar from "@material-ui/core/Snackbar";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import eventBus from "../../utils/event-bus";

const styles: any = theme => ({
  root: {
    width: "100%",
    overflowX: "auto",
    overflowY: "auto"
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    }
  }
});

const ReduceStockDialog = props => {
  // const [recoverBtnDisable, setRecoverBtnDisable] = useState(true)
  let recoverBtnDisable = true;
  let targetData: any = null;

  const [msgObj, setMsgObj] = useState({
    message: "",
    open: false
  });

  const [dialogObj, setDialogObj] = useState({
    type: 1,
    open: false,
    content: "",
    title: ""
  });

  const { classes } = props;
  const title = props.dialogObject.title;
  const isRemind = props.dialogObject.type === "reduce-stock-remind";
  let contentData = props.dialogObject.data;
  const pos = props.dialogObject.pos || {};
  const { position_id: positionId } = contentData[0] || {};

  // 已自动减仓列表
  let reducedStockList: any[] = [];

  // 计划自动减仓列表
  let willReduceStockList: any[] = [];

  // 降序
  contentData = contentData.sort((a, b) => {
    return getTimestamp(b.decay_date) - getTimestamp(a.decay_date);
  });

  if (isRemind) {
    // 减仓提醒 ====
    reducedStockList = contentData.filter(v => v.status !== "0");

    // 升序排序
    willReduceStockList = contentData
      .filter(v => v.status === "0")
      .sort((a, b) => {
        return getTimestamp(a.decay_date) - getTimestamp(b.decay_date);
      });
  } else {
    // 自动减仓管理 ====

    reducedStockList = contentData;

    targetData = reducedStockList[0];

    const nowTs = getTimestamp(getYyyyMmDd());
    // 查找减仓日期小于当天的记录
    const tempList = contentData.filter(
      x => getTimestamp(x.decay_date) < nowTs
    );
    tempList.forEach(v => {
      v.time_diff = nowTs - getTimestamp(v.decay_date);
    });
    tempList.sort((a, b) => {
      return a.time_diff - b.time_diff;
    });

    if (tempList.length > 0) {
      targetData = tempList[0];
      tempList[0].is_highlight = true;

      if (tempList[0].status === "1") {
        // 1 不置灰，非 1 置灰
        recoverBtnDisable = false;
      }
    }
  }

  const addMinusSign = (side?) => {
    return Number(side) === 0 ? "-" : "";
  };

  const parseStatus = (status: string) => {
    switch (status) {
      case "0":
        return "未执行";
      case "1":
        return "已执行";
      case "2":
        return "已终止";
      case "3":
        return "已恢复";
    }
  };

  const closeDialog = () => {
    props.close("closed");
  };

  const reduceStock = (positionId, type) => {
    reduceStockManagement(positionId, type)
      .then(res => {
        console.log("reduceStockManagement >> ", res);
        setDialogObj({
          type: 1,
          title: "",
          content: "",
          open: false
        });

        setMsgObj({
          message: res.message,
          open: true
        });

        eventBus.emit("close-reduce-stock");
      })
      .catch(err => {
        console.error("reduceStockManagement >> ", err);
      });
  };

  const recover = () => {
    const { decay_unit, position_unit, side } = targetData || {};
    const moneySum = decay_unit + position_unit || 0;
    setDialogObj({
      type: 1,
      title: "恢复最近仓位",
      content: `${pos.ticker} ${pos.security_name} 仓位恢复至 ${addMinusSign(
        side
      ) + abbrNum(moneySum)}`,
      open: true
    });
  };

  const maintain = () => {
    const { position_unit, side } = targetData || {};
    setDialogObj({
      type: 2,
      title: "维持当前仓位",
      content: `${pos.ticker} ${pos.security_name} 维持当前仓位 ${addMinusSign(
        side
      ) + abbrNum(position_unit || 0)}`,
      open: true
    });
  };

  const handleClose = (type?: string) => {
    if (type === "d") {
      setDialogObj({
        type: 1,
        title: "",
        content: "",
        open: false
      });
    } else {
      setMsgObj({
        message: "",
        open: false
      });
    }
  };

  const handleDialogOK = (type: number = 1) => {
    reduceStock(positionId, type);
  };

  return (
    <div className="lighten-up-dialog-box">
      <div className="content-box">
        <div className="header">
          <div className="title">{title}</div>
          {isRemind && (
            <div className="to-management-lighten-up">
              <Link
                to={{
                  pathname: `/portfolio`,
                  state: {
                    purpose: "add"
                  }
                }}
                onClick={closeDialog}
              >
                管理自动减仓交易
              </Link>
            </div>
          )}
          <div className="close" onClick={closeDialog}>
            ×
          </div>
        </div>
        <div className="body">
          <div className="content-item">
            {isRemind && <div className="table-title">已自动减仓</div>}
            <Paper className={classes.root}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">股票代码</TableCell>
                    <TableCell align="center">股票简称</TableCell>
                    <TableCell align="center">减仓金额</TableCell>
                    <TableCell align="center">目前持仓</TableCell>
                    <TableCell align="center">减仓日期</TableCell>
                    <TableCell align="center">处理状态</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reducedStockList.map(row => {
                    return (
                      <TableRow
                        key={row.id}
                        className={
                          row.is_highlight ? "highlight-row" : classes.row
                        }
                      >
                        {/* 股票代码 */}
                        <TableCell align="center">{row.ticker}</TableCell>
                        {/* 股票简称 */}
                        <TableCell align="center">{row.name}</TableCell>
                        {/* 减仓金额 */}
                        <TableCell align="center">
                          {abbrNum(row.decay_unit)}
                        </TableCell>
                        {/* 目前持仓 */}
                        <TableCell align="center">
                          {addMinusSign(row.side) + abbrNum(row.position_unit)}
                        </TableCell>
                        {/* 减仓日期 */}
                        <TableCell align="center">{row.decay_date}</TableCell>
                        {/* 处理状态 */}
                        <TableCell align="center">
                          {parseStatus(row.status)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
          </div>

          {isRemind && (
            <div className="content-item">
              <div className="table-title">计划自动减仓</div>
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">股票代码</TableCell>
                      <TableCell align="center">股票简称</TableCell>
                      <TableCell align="center">减仓金额</TableCell>
                      <TableCell align="center">目前持仓</TableCell>
                      <TableCell align="center">减仓日期</TableCell>
                      <TableCell align="center">处理状态</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {willReduceStockList.map(row => {
                      return (
                        <TableRow key={row.id}>
                          {/* 股票代码 */}
                          <TableCell align="center">{row.ticker}</TableCell>
                          {/* 股票简称 */}
                          <TableCell align="center">{row.name}</TableCell>
                          {/* 减仓金额 */}
                          <TableCell align="center">
                            {abbrNum(row.decay_unit)}
                          </TableCell>
                          {/* 目前持仓 */}
                          <TableCell align="center">
                            {addMinusSign(row.side) +
                              abbrNum(row.position_unit)}
                          </TableCell>
                          {/* 减仓日期 */}
                          <TableCell align="center">{row.decay_date}</TableCell>
                          {/* 处理状态 */}
                          <TableCell align="center">
                            {parseStatus(row.status)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Paper>
            </div>
          )}

          {!isRemind && (
            <div className="content-item reduce-stock-management">
              <Button
                variant="contained"
                onClick={recover}
                disabled={recoverBtnDisable}
              >
                恢复最近仓位
              </Button>

              <Button variant="contained" onClick={maintain}>
                维持当前仓位
              </Button>

              <Button variant="contained">
                <Link
                  className="link"
                  to={{
                    pathname: `/order/create`,
                    state: {
                      purpose: "other",
                      portfolio: pos.portfolio,
                      is_buy: pos.side === 1,
                      security: pos.security,
                      pos
                    }
                  }}
                  onClick={closeDialog}
                >
                  进行其它交易
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        open={msgObj.open}
        autoHideDuration={3000}
        onClose={() => handleClose("m")}
        message={<span>{msgObj.message}</span>}
      />
      <Dialog open={dialogObj.open} onClose={() => handleClose("d")}>
        <DialogTitle>{dialogObj.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogObj.content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleDialogOK(dialogObj.type)}
            color="primary"
            autoFocus
          >
            确定
          </Button>
          <Button onClick={() => handleClose("d")}>取消</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default withStyles(styles)(ReduceStockDialog);

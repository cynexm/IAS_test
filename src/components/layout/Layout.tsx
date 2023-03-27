import { Divider, ListItemText, MenuItem } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
  AppBar,
  changeLocale as changeLocaleAction,
  Layout
} from "react-admin";
import { connect } from "react-redux";
import ISAMenu from "./Menu";
import { ISANotification } from "./Notification";
import UserMenu from "./UserMenu";
import ReduceStockDialog from "../reduce-stock-dialog/reduce-stock-dialog";
import ReduceStockRule from "../reduce-stock-rule/reduce-stock-rule";

import "./Layout.css";
import { getReduceStockContent } from "../../utils/reduce-stock";
import eventBus from "../../utils/event-bus";
import storage, { Storage } from "../../core/Storage";
import { isShow, modifyShow, showHandle } from "../../utils/common-utils";
import ChartCsvDialog from "../chart-csv-dialog/chart-csv-dialog";

const ISAUserMenu = connect(
  undefined,
  { changeLocale: changeLocaleAction }
)(({ changeLocale, ...props }: any) => (
  <UserMenu {...props}>
    <div>
      <MenuItem button onClick={changeLocale.bind(null, "en")}>
        <ListItemText primary="English" />
      </MenuItem>
    </div>
    <div>
      <MenuItem button onClick={changeLocale.bind(null, "zh")}>
        <ListItemText primary="中文" />
      </MenuItem>
    </div>
    <Divider />
  </UserMenu>
));

const ISAAppBar = props => (
  <AppBar {...props} position="sticky" userMenu={<ISAUserMenu />}></AppBar>
);

const ISALayout = props => {
  const [show, setShow] = useState(false);
  const [dialogObject, setDialogObject] = useState({
    title: "",
    type: "",
    data: [],
    pos: null
  });
  showHandle("RefreshShowFlag");

  let loginShow: boolean = isShow("LoginShowFlag");
  let refreshShow: boolean = isShow("RefreshShowFlag");
  const isAdmin = storage.get(Storage.Keys.AuthPriv) === "apm";

  const [showChartDialog, setShowChartDialog] = useState(false);
  const [chartDialogData, setChartDialogData] = useState<any>(null);

  // 使用 useEffect 模拟函数式组件生命周期 首次渲染
  useEffect(() => {
    // 订阅打开弹窗事件
    eventBus.addListener("open-reduce-stock", e => {
      setDialogObject({
        data: e.data,
        title: "自动减仓管理",
        type: "reduce-stock-management",
        pos: e.pos
      });
      setShow(true);
    });

    // 订阅关闭弹窗事件
    eventBus.addListener("close-reduce-stock", () => {
      setShow(false);
      setTimeout(() => {
        window.location.reload();
      }, 200);
    });

    getReduceStockContent()
      .then(res => {
        console.log("getReduceStockContent >> ", res);
        storage.set(Storage.Keys.ReduceStockList, res);

        if (res.length) {
          if (loginShow || refreshShow) {
            loginShow && modifyShow("LoginShowFlag", false);
            refreshShow && modifyShow("RefreshShowFlag", false);
            setShow(true);
            setDialogObject({
              data: res as never[],
              title: "自动减仓提醒",
              type: "reduce-stock-remind",
              pos: null
            });
          }
        }
      })
      .catch(err => {
        console.error("getReduceStockContent >> ", err);
      });

    // 订阅打开月度回报数据图表弹窗事件
    eventBus.addListener("open-chart-csv", data => {
      setChartDialogData(data);
      setShowChartDialog(true);
    });
  }, []);

  return (
    <div className="isa-main-container">
      <Layout
        {...props}
        notification={ISANotification}
        menu={ISAMenu}
        appBar={ISAAppBar}
      />
      {show && (
        <ReduceStockDialog
          close={() => setShow(false)}
          dialogObject={dialogObject}
        />
      )}
      {showChartDialog && (
        <ChartCsvDialog
          close={() => setShowChartDialog(false)}
          data={chartDialogData}
        />
      )}
      <div
        className="auto-reduce-stock-rule-box"
        style={{ top: isAdmin ? "320px" : "230px" }}
      >
        <ReduceStockRule />
      </div>
    </div>
  );
};
export default ISALayout;

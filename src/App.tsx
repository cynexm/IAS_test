import amber from "@material-ui/core/colors/amber";
import orange from "@material-ui/core/colors/orange";
import red from "@material-ui/core/colors/red";
import { createMuiTheme } from "@material-ui/core/styles";
import {
  Book,
  Dashboard,
  Description,
  DesktopMac,
  FolderOpen,
  Group,
  ShoppingBasket,
  ViewList,
  Bookmark
} from "@material-ui/icons";
import jsonServerProvider from "ra-data-json-server";
import React from "react";
import { Admin, Resource } from "react-admin";
import "./App.css";
import DashboardPage from "./components/Dashboard";
import ISALayout from "./components/layout/Layout";
import { OrderList } from "./components/Order/OrderList";
import { PortfolioList } from "./components/Portfolio/PortfolioList";
import {
  ApiPrefix,
  EnvConfig,
  HostPrefix,
  Pages,
  PrivilegeSet
} from "./environment";
import { drfHttpClient } from "./providers/api";
import authProvider from "./providers/auth";
import drfProvider from "./providers/drf";

import { Route } from "react-router";
import { ISALogin } from "./components/Login";
import { OrderCreate } from "./components/Order/OrderCreate";
import { OrderShow } from "./components/Order/OrderShow";
import { PortfolioCreate } from "./components/Portfolio/PortfolioCreate";
import { PortfolioShow } from "./components/Portfolio/PortfolioShow";
import { tradingRulesReducer, updateRules } from "./core/TradingRules";
import { TradingRules } from "./pages/TradingRules";
import { i18nProvider } from "./providers/i18n";
import { UserCreate } from "./components/User/UserCreate";
import { UserList } from "./components/User/UserList";
import { UserEdit } from "./components/User/UserEdit";
import {
  SecuritiesPoolList,
  SecuritiesPoolCreate
} from "./components/SecuritiesPool";
import storage, { Storage } from "./core/Storage";

const theme = createMuiTheme({
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "Apple LiSung Light",
      "Apple LiGothic Medium",
      "Microsoft YaHei",
      "Microsoft JhengHei",
      "Roboto",
      "Arial",
      "sans-serif",
      "Apple Color Emoji",
      "Segoe UI Emoji",
      "Segoe UI Symbol"
    ].join(",")
  },
  palette: {
    primary: amber,
    secondary: orange,
    error: red,
    contrastThreshold: 3,
    tonalOffset: 0.2
  }
});

const pages = (isAdmin: boolean, username: string | null) => ({
  // 组合管理
  [Pages.PortfolioSummary]: (
    <Resource
      key={Pages.PortfolioSummary}
      icon={Dashboard}
      name="portfolio"
      options={{ label: "resources.portfolio.title" }}
      list={PortfolioList}
      show={PortfolioShow}
      create={isAdmin && PortfolioCreate}
    />
  ),

  [Pages.PositionSummary]: (
    <Resource
      key={Pages.PositionSummary}
      name="positions"
      options={{ hidden: true }}
    />
  ),

  [Pages.PortfolioManagement]: (
    <Resource
      key={Pages.PortfolioManagement}
      icon={ShoppingBasket}
      name="portfoliomanager"
      options={{ hidden: true }}
    />
  ),

  // 用户管理
  [Pages.UserManagement]: (
    <Resource
      key={Pages.UserManagement}
      icon={Group}
      name="users"
      options={{ label: "resources.users.title", hidden: !isAdmin }}
      list={isAdmin && UserList}
      create={isAdmin && UserCreate}
      edit={isAdmin && UserEdit}
    />
  ),

  // 订单管理
  [Pages.Order]: (
    <Resource
      key={Pages.Order}
      name="order"
      options={{ label: "resources.order.title" }}
      list={OrderList}
      create={OrderCreate}
      show={OrderShow}
      icon={Book}
    />
  ),

  // 分析股票池
  [Pages.SecuritiesPool]: (
    <Resource
      key={Pages.SecuritiesPool}
      name="pool"
      options={{
        label: "resources.pool.title",
        hidden: !isAdmin && username !== "bobjiang"
      }}
      icon={Bookmark}
      list={SecuritiesPoolList}
      create={SecuritiesPoolCreate}
    />
  ),

  [Pages.Security]: (
    <Resource
      key={Pages.Security}
      options={{ hidden: true }}
      name="securities"
    />
  ),

  [Pages.Institute]: (
    <Resource
      key={Pages.Institute}
      options={{ hidden: true }}
      name="institutes"
    />
  ),

  [Pages.PortfolioSimpleList]: (
    <Resource
      key={Pages.PortfolioSimpleList}
      options={{ hidden: true }}
      name="portfoliolist"
    />
  )
});

const customRoutes = [
  <Route exact path="/trade-rules" component={DashboardPage} />
];

const App = () => (
  <Admin
    title="ISA-Web"
    theme={theme}
    locale="zh"
    loginPage={ISALogin}
    i18nProvider={i18nProvider}
    appLayout={ISALayout}
    authProvider={authProvider}
    customRoutes={customRoutes}
    customSagas={[updateRules]}
    customReducers={{ tradeRules: tradingRulesReducer }}
    dataProvider={
      drfProvider(`${HostPrefix}${ApiPrefix}`, drfHttpClient as any)
    }
  >
    {(permission) => {
      const username = storage.get(Storage.Keys.AuthUser);
      const allPages = pages(permission === "apm", username);
      return Object.keys(allPages).map((page) => allPages[page]);  // 对象转数组
    }}
  </Admin>
);
console.debug("Environment: ", process.env.NODE_ENV);
export default App;

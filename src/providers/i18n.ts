import { merge } from "lodash";
// import polyglotI18nProvider from "ra-i18n-polyglot";
import chineseMessages from "ra-language-chinese";
import englishMessages from "ra-language-english";
import { resolveBrowserLocale } from "react-admin";

export const DictEn = {
  valueTrans: {
    orderStatus: {
      0: "pending",
      1: "approved",
      2: "closed",
    },
    executionStatus: {
      0: "pending",
      1: "executed",
    },
    executionType: {
      1: "Touch",
      2: "Vwap",
      3: "Decay",
      4: "DecayCancel"
    },
    positionSide: {
      0: "short",
      1: "long",
    },
    ideaType: {
      0: "Bottom up, single stock",
      1: "Top down, sector",
      2: "Hedge/other",
    },
    isBuy: {
      buy: "buy",
      sell: "sell",
    },
    purpose: {
      open: "Open",
      add: "Add",
      close: "Close",
      reduce: "Reduce",
      decay: "Decay",
      decaycancel: "Decay Cancel"
    },
    params_leading_position: {
      1: "Other",
      2: "Subdominant",
      3: "Dominant",
    },
    params_upside: {
      1: "<100%",
      2: "100% - 300%",
      3: ">300%",
    },
    params_downside_risk: {
      1: "0 - 10%",
      2: "10% - 20%",
      3: "20% - 30%",
    },
  },
  actions: {
    name: "Actions",
    cancel: "Cancel",
    override: "Override",
    update: "Update",
    approve: "Approve",
    confirm: "Confirm",
  },
  resources: {
    portfolio: {
      name: "Portfolios",
      title: "Portfolios",
      detail: "Portfolio Detail",
      portfolio_return: "Portfolio return",
      stats: "Portfolio stats",
      fields: {
        name: "Portfolio name",
        managers: "Users",
        invested_size: "Utilized capital",
        current_cap: "Current Market Cap",
        summary: {
          market_cap: "market cap",
          position_market_cap: "market cap",
          current_position: "current position",
          market_exposure: "Market exposure",
          pnl: "pnl",
        },
        user: "User",
        institute: "Institute",
        institutes: "Institutes",
        stats: {
          cost_on_book: "Cost(RMB)/portion against book",
          mtd_turnover: "MTD turnover",
          benchmark: "Benchmark",
        },
        t_mtd_alpha: "MTD alpha",
        t_ytd_alpha: "YTD alpha",
        alpha: "Alpha",
        net_return: "Net return",
        gross_return: "Gross return",
        net_pnl: "Net pnl",
        gross_pnl: "Gross pnl",
      },
    },
    users: {
      name: "Users",
      title: "Users",
    },
    positions: {
      name: "Positions",
      title: "Positions",
      notional: "Total notional",
      dividend: "Dividend",
      stock_dividend: "Stock dividend",
      writes_offer: "Writes offer",
      per_share: "every %{shares} shares",
      fields: {
        name: "Name",
        open: "Open",
        closed: "Closed",
      },
    },
    order: {
      name: "Orders",
      title: "Orders",
      fields: {
        sn: "Serial ID",
        is_buy: "Direction",
        execution: {
          approved_unit: "Approved notional",
          cost: "Trade cost",
          cost_bps: "Cost(bps)",
          avg_fill_price: "Fill price",
          moment_px: "Moment price",
          notional_limit: "Notional limit",
          filled_time: "Filled time",
          created: "Approved time",
        },
        created: "Order created",
        reason_txt: "Trade rationale",
        security: "Company name",
        portfolio: "Portfolio name",
        id: "Order ID",
        notional_unit: "Request notional",
        user: "User",
        ticker: "Ticker",
        currency: "Currency",
      },
    },
    pool: {
      name: "Rule of 3",
      title: "Rule of 3",
      mypool: "My Pool",
      create: "Create new record",
      fields: {
        params_analysis: "Analysis",
        params_downside_risk: "Downside_risk",
        params_leading_position: "Market share",
        params_profit_growth_rate: "Profit growth %",
        params_revenue_growth_rate: "Revenue growth %",
        params_upside: "Upside",
        removal_reason: "Removal reason",
        spot_px: "Spot px",
        user_name: "User name",
        security_name: "Security Name",
        count: "Records#",
        growth_rate: "Choose growth rate",
      },
    },
  },
  common: {
    guide: "User Guide",
    datetime: "System datetime",
    historical_return: "Historical return",
    mtd: "MTD",
    qtd: "QTD",
    ytd: "YTD",
    pending_vwap: "pending VWAP orders execution",
    pnl: " PNL",
    total: "Total",
    daily: "Daily",
    monthly: "Monthly",
    price_change: " price change",
    since_open: "",
    time: " time",
    dividend: "Dividend",
    no_record: "No record found",
    contact_admin: "Please contact admin to trade this ticker",
    mv: "MV",
    price: " price",
    last: "last",
    avg_cost: "AVG cost",
    no_audio: "No audio",
    idea_type_title: "Please choose idea type",
    million: "million",
    asset: "Asset",
    estimated_cost: "Estimated cost",
    portfolio: " portfolio",
    create: "Create",
    search: "Search asset",
    high: "high",
    low: "low",
    open: "open",
    close: "close",
    volume: "volume",
    divisible: "must be divisible by 5",
    limit: " limit",
    positions: " positions",
    exceed: "exceeds",
    order: " order",
    created: "Created",
  },
  notification: {
    confirmed: "Order reason confirmed",
    approved: "Order approved for execution",
    canceled: "Order canceled or rejected",
    overrided: "Order details overrided",
    updated: "Order reason updated",
    paramupdated: "Portfolio params updated",
    error: "error",
  },
};

export const DictZh = {
  valueTrans: {
    orderStatus: {
      0: "待定",
      1: "通过",
      2: "关闭",
    },
    executionStatus: {
      0: "待执行",
      1: "已执行",
    },
    executionType: {
      1: "Touch",
      2: "VWAP",
      3: "自动减仓",
      4: "自动减仓取消"
    },
    positionSide: {
      0: "空头",
      1: "多头",
    },
    ideaType: {
      0: "自下而上，个股推荐",
      1: "自上而下，行业配置",
      2: "对冲或其他",
    },
    isBuy: {
      buy: "买入",
      sell: "卖出",
    },
    purpose: {
      open: "建仓",
      add: "加仓",
      close: "清仓",
      reduce: "减仓",
      decay: "自动减仓",
      decaycancel: "自动减仓取消",
      other: "其他"
    },
    reduce_stock_status: {
      1: "已处理",
      2: "未处理",
      3: "----"
    },
    params_leading_position: {
      1: "其他",
      2: "龙二",
      3: "龙头",
    },
    params_upside: {
      1: "<100%",
      2: "100% - 300%",
      3: ">300%",
    },
    params_downside_risk: {
      1: "0 - 10%",
      2: "10% - 20%",
      3: "20% - 30%",
    },
  },
  actions: {
    name: "操作",
    cancel: "取消",
    override: "更改",
    update: "更改交易原因",
    approve: "通过",
    confirm: "确认交易原因",
  },
  resources: {
    portfolio: {
      name: "模拟投资组合列表",
      detail: "组合详情",
      title: "组合管理",
      portfolio_return: "组合回报",
      stats: "组合统计",
      fields: {
        name: "组合名称",
        created: "创建日期",
        book_size: "组合设定规模(人民币)",
        invested_size: "已使用头寸",
        cash: "未使用头寸",
        last_traded: "最后交易时间",
        managers: "用户",
        current_cap: "实际市值",
        current_position: "当前实际仓位",
        current_exposure: "风险敞口",
        mtd_return: "MTD回报",
        mtd_alpha: "MTD优化超额收益",
        t_mtd_alpha: "MTD优化超额收益",
        ytd_return: "YTD回报",
        ytd_alpha: "YTD优化超额收益",
        t_ytd_alpha: "YTD优化超额收益",
        drawdown: "回撤",
        summary: {
          market_cap: "实际市值",
          current_position: "当前实际仓位",
          market_exposure: "风险敞口",
          pnl: "当日回报",
          pnl_percent: "当日回报",
        },
        user: "用户姓名",
        institute: "公司/机构",
        days_idle: "距上次登录天数",
        institutes: "公司/机构",
        stats: {
          cost_on_book: "当月交易成本(人民币)/占组合规模比例",
          mtd_turnover: "MTD换手量",
          benchmark: "当月指数回报",
        },
        alpha: "优化超额收益",
        net_return: "净回报",
        gross_return: "毛回报",
        net_pnl: "净盈亏(人民币)",
        gross_pnl: "毛盈亏(人民币)",
        description: "组合简介",
      },
    },
    positions: {
      name: "仓位列表",
      notional: "当前仓位规模",
      dividend: "股息",
      stock_dividend: "送股",
      writes_offer: "配股",
      per_share: "每%{shares}股",
      fields: {
        open: "当前仓位",
        closed: "已平仓",
      },
    },
    users: {
      name: "用户列表",
      detail: "用户详情",
      title: "用户管理",
      fields: {
        id: "用户ID",
        username: "用户名",
        password: "密码",
        is_intlacc: "内部账号",
        is_staff: "管理员账号",
        last_login: "上次登陆",
        first_name: "名",
        last_name: "姓",
        institute: "公司/机构",
      },
    },
    order: {
      name: "订单列表",
      detail: "订单详情",
      title: "订单管理",
      fields: {
        sn: "订单编号",
        id: "ID",
        security: "公司名称",
        portfolio: "模拟组合",
        is_buy: "交易方向",
        status: "订单状态",
        security_adv: "30日平均成交量(百万)",
        notional_limit: "此订单限额(百万)",
        execution: {
          status: "订单状态",
          approved_unit: "已执行金额",
          cost: "交易成本",
          cost_bps: "成本(基点)",
          avg_fill_price: "成交价格",
          moment_px: "市场价格",
          vwap_px: "VWAP价格",
          filled_time: "实际执行时间",
          created: "批准时间",
        },
        position_notional: "当时仓位规模",
        existing_notional: "现有仓位规模",
        trx_purpose: "交易目的",
        fill_price: "执行价格",
        user: "用户姓名",
        created: "订单创建时间",
        execution_type: "执行方式",
        reduce_stock_status: "自动减仓状态",
        notional_unit: "提出交易金额",
        currency: "货币",
        reason_audio: "音频",
        reason_txt: "交易原因",
        reason: "交易原因(APM)",
        last_modified: "最后更新时间",
        ticker: "代码",
        admin_note: "APM备注",
        confirmed: "原因确认",
      },
    },
    pool: {
      name: "分析股票池",
      title: "分析股票池",
      mypool: "我的股票池",
      create: "新建股票池记录",
      fields: {
        params_analysis: "详细分析",
        params_downside_risk: "下行风险",
        params_leading_position: "行业地位",
        params_profit_growth_rate: "利润增长率",
        params_revenue_growth_rate: "营收增长率",
        params_upside: "增长预期",
        removal_reason: "移除原因",
        spot_px: "加入时价格",
        user_name: "用户名",
        security_name: "公司名称",
        count: "加入次数",
        growth_rate: "选择增长率类型",
      },
    },
    performance: {
      fields: {
        current_market_exposure: "Current Net Exposure",
      },
    },
  },
  common: {
    guide: "系统说明",
    datetime: "系统日期",
    // historical_return: "历史月度回报",
    historical_return: "业绩归因和历史月度回报数据",
    mtd: "月度",
    qtd: "季度",
    ytd: "年初至今",
    pending_vwap: "有待完成的vwap平仓订单",
    pnl: "盈亏",
    total: "总",
    daily: "当日",
    monthly: "当月",
    price_change: "股价变动",
    since_open: "建仓以来",
    time: "时间",
    dividend: "分红送配",
    ex_dividend_time: "除权除息日",
    no_record: "暂无相关数据",
    contact_admin: "暂无记录，如需交易请联系IAS管理员",
    mv: "当前市值",
    price: "价格",
    last: "最后",
    avg_cost: "平均成本",
    no_audio: "无音频",
    idea_type_title: "请选择订单类型",
    million: "百万",
    asset: "投资资产",
    estimated_cost: "预估成本",
    portfolio: "模拟组合",
    create: "创建",
    search: "检索资产",
    high: "高",
    low: "低",
    open: "开",
    close: "收",
    volume: "量",
    divisible: "必须是5的整数倍",
    limit: "允许额度",
    positions: "组合仓位",
    exceed: "超过",
    order: "订单",
    created: "创建日期",
  },
  notification: {
    confirmed: "交易原因确认",
    approved: "交易已经通过",
    canceled: "交易已经取消",
    overrided: "交易已经更改",
    updated: "交易原因已经更改",
    paramupdated: "组合管理参数已经更改",
    error: "遇到错误",
  },
};

const messages = {
  zh: merge({}, chineseMessages, DictZh),
  en: merge({}, englishMessages, DictEn),
};
export const i18nProvider = (locale) =>
  messages[locale] ? messages[locale] : messages.zh;

// export const i18nProvider = polyglotI18nProvider(
//   (locale) => (messages[locale] ? messages[locale] : messages.en),
//   resolveBrowserLocale()
// );

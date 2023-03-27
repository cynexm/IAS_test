import React, { useEffect, useState } from "react";
import "./chart-csv-dialog.css";
import { getMonthReport } from "../../providers/api";
import ReceiptIcon from "@material-ui/icons/Receipt";
import { Button as MuiButton } from "@material-ui/core";
import { HostPrefix } from "../../environment";
import ReactECharts from 'echarts-for-react';

const ChartCsvDialog = props => {
  const portfolioId = props.data.id
  const options = {
    title: {
      text: "组合超额收益归因分析",
      left: "center"
    },
    tooltip: {
      trigger: "axis",
      formatter (params) {
        let relVal = params[0].name
        for (let i = 0, l = params.length; i < l; i++) {
          const circle = `<div class="echart-line-circle-point" style="border-color:${params[i].color}"></div>`
          relVal += '<br/>' + circle + params[i].seriesName + '：' + (params[i].value * 100).toFixed(2) + '%'
        }
        return relVal
      }
    },
    legend: {
      data: ["总超额收益", "风格贡献", "行业贡献", "选股贡献"],
      bottom: 0,
      padding: 0,
      itemHeight: 12
    },
    grid: {
      left: "2%",
      right: "1%",
      top: "8%",
      bottom: "4%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      boundaryGap: true,
      axisLabel: {
        interval: 0,
        rotate: 45,
        fontWeight: "bold",
        fontSize: 14
      },
      data: []
    },
    yAxis: {
      type: "value",
      splitNumber: 10,
      axisLabel: {
        formatter: function (value) {
          return (value * 100).toFixed(2) + '%'
        },
        fontWeight: "bold",
        fontSize: 14
      }
    },
    series: [
      {
        name: "总超额收益",
        type: "line",
        data: []
      },
      {
        name: "风格贡献",
        type: "line",
        data: []
      },
      {
        name: "行业贡献",
        type: "line",
        data: []
      },
      {
        name: "选股贡献",
        type: "line",
        data: []
      }
    ]
  };
  const [tgtOptions, setTgtOptions] = useState(options);

  const closeDialog = () => {
    props.close("closed");
  };

  useEffect(() => {
    getMonthReport(portfolioId)
      .then(res => {
        console.log("getMonthReport >> ", res);
        if (res.results) {
          options.xAxis.data = res.results.map(x => x.date);
          // 0 总超额收益，1 风格贡献，2 行业贡献，3 选股贡献
          options.series[0].data = res.results.map(x => x.total_effect);
          options.series[1].data = res.results.map(x => x.style_effect);
          options.series[2].data = res.results.map(x => x.industry_effect);
          options.series[3].data = res.results.map(x => x.idio_effect);

          setTgtOptions(JSON.parse(JSON.stringify(options)));
        }
      })
      .catch(err => {
        console.error("getMonthReport >> ", err);
      });
  }, []);

  return (
    <div className="chart-csv-dialog-box">
      <div className="content-box">
        <div className="header">
          <div className="title">业绩归因和历史月度回报数据</div>
          <div className="close" onClick={closeDialog}>
            ×
          </div>
        </div>
        <div className="body">
          <div className="top-box">
            <MuiButton
              color="primary"
              href={
                props.data
                  ? `${HostPrefix}/export/csv/ZIDFQWER/${props.data.id}/performance`
                  : "#"
              }
            >
              <ReceiptIcon /> 历史月度回报
            </MuiButton>
          </div>
          <div className="bottom-box">
            <div className="bottom-1">
              <ReactECharts style={{ width: '100%', height: '100%' }} option={tgtOptions} />
            </div>
            <div className="bottom-2">
              *Barra收益归因的分析结果可能与组合实际超额收益有出入，以IAS系统为准。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartCsvDialog;

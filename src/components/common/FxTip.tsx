import { Typography } from "@material-ui/core"
import React, { useEffect, useMemo } from "react"
import { Security } from "../../core/model"
import { fetchFxRate } from "../../providers/api"

const BASE_CURRENCY = "CNY"

export function FxTip({ security, style }: { security: Security | undefined; style?: any }) {
  const [fxRate, setFxRate] = React.useState<any>(null)
  useEffect(() => {
    if (!fxRate) {
      fetchFxRate().then(({ rates }: any) => {
        setFxRate(rates)
      })
    }
  }, [])
  const currentRate = useMemo(() => {
    if (
      security?.currency !== BASE_CURRENCY &&
      fxRate &&
      security &&
      fxRate[security.currency] > 0
    ) {
      return (fxRate[BASE_CURRENCY] / fxRate[security.currency]).toFixed(4)
    }
    return null
  }, [security, fxRate])

  return !security ? null : (
    <>
      {security && currentRate && (
        <Typography component="p" variant="body2" style={style}>
          您将要交易的{security.name}(代码:{security.ticker}
          )的货币为{security.currency}
          ，不等于本投资组合的基准货币CNY，继续交易将会涉及外汇风险，持仓盈亏(pnl)以标的资产货币为准，CNY/
          {security.currency}的汇率现价为
          {currentRate}
          ，继续创建订单将被视为已知悉该风险。
        </Typography>
      )}
    </>
  )
}

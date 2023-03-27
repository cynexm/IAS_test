import React from 'react';
import { Toolbar, SaveButton } from 'react-admin';
import './custom-toolbar.css'


export const CustomToolbar = ({ ...rest }) => {
  return (
    <Toolbar>
      <SaveButton {...rest} />
    </Toolbar>
  )
}

export const CustomToolbar2 = ({ ...rest }) => {
  return (
    <Toolbar>
      <SaveButton disabled={true} {...rest} />
      <div className="botx-ticker-toast">该股票流动性不足，暂不支持交易</div>
    </Toolbar>
  )
}



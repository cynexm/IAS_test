import { Button } from '@material-ui/core'
import React, { Component } from 'react'
import { changeLocale as changeLocaleAction } from 'react-admin'
import { connect, InferableComponentEnhancerWithProps } from 'react-redux'

const LocaleSwitcherInner = ({ changeLocale }) => {
  return (
    <div>
      <div>Language</div>
      <Button onClick={changeLocale.bind(null, 'en')}>English</Button>
      <Button onClick={changeLocale.bind(null, 'zh')}>中文</Button>
    </div>
  )
}

export const LocaleSwitcher = connect(undefined, { changeLocale: changeLocaleAction })(
  LocaleSwitcherInner
)
export default LocaleSwitcher

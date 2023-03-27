import { Typography } from "@material-ui/core";
import get from "lodash/get";
import React, { FunctionComponent } from "react";
import { translate as withTranslate } from "react-admin";

export const TransField = withTranslate(
  ({
    source,
    record = {},
    transKey,
    translate,
    keyInter,
    addTxt,
    ...props
  }: {
    source;
    record?;
    transKey: string;
    keyInter: (rawValue: any) => string;
    translate?;
    addTxt?;
  }) => (
    <Typography component="span" {...props}>
      {get(record, source) !== undefined &&
        translate(
          `${transKey}.${(keyInter && keyInter(get(record, source))) ||
            get(record, source)}`
        )}{" "}
      {addTxt && `(${addTxt})`}
    </Typography>
  )
) as FunctionComponent<{
  keyInter?: (rawValue: any) => string;
  source: string;
  transKey: string;
  [other: string]: any;
}>;

TransField.defaultProps = { addLabel: true };

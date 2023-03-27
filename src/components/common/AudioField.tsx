import { Typography } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { translate as withTranslate } from "react-admin";

export const AudioField = withTranslate(
  ({
    source,
    record = {},
    transKey,
    translate,
    ...props
  }: {
    source;
    record?;
    transKey: string;
    translate?;
  }) => {
    let src = record && record[source];
    return src ? (
      <audio style={{ width: "360px", height: "24px" }} controls src={src} />
    ) : (
      <Typography color="textSecondary" component="span" variant="body2">
        {translate("common.no_audio")}
      </Typography>
    );
  }
) as FunctionComponent<{
  source: string;
  [other: string]: any;
}>;
AudioField.defaultProps = {
  addLabel: true
};
export default AudioField;

import React from "react";
import { SelectInput, translate as withTranslate } from "react-admin";
import { Currency, ExecutionType } from "../../core/model";
const choices = Object.entries(ExecutionType).map(([type, typeValue]) => ({
  type,
  typeValue
}));
export const ExecutionTypeSelector = withTranslate(
  ({ translate, ...props }) => (
    <SelectInput
      {...props}
      choices={Object.entries(ExecutionType).map(([type, typeValue]) => ({
        type: translate(`valueTrans.executionType.${typeValue}`),
        typeValue
      }))}
      optionText="type"
      optionValue="typeValue"
    />
  )
);

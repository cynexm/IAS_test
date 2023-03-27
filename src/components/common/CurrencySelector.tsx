import React from "react";
import { SelectInput } from "react-admin";
import { Currency } from "../../core/model";
const choices = Object.entries(Currency).map(([fullName, name]) => ({
  fullName,
  name,
  id: name
}));
console.debug("Choices: ", choices);
export const CurrencySelector = props => (
  <SelectInput
    {...props}
    choices={choices}
    optionText="name"
    optionValue="name"
  />
);

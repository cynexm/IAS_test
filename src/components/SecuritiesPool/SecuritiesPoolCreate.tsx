import React, { useState, useMemo, useEffect } from "react";
import {
  Create,
  SimpleForm,
  SelectInput,
  NumberInput,
  withTranslate,
  FormDataConsumer,
  LongTextInput,
  required,
  minValue,
  maxValue,
} from "react-admin";
import { change } from "redux-form";

import { Security } from "../../core/model";
import { SecurityInput, TickerPanel } from "../common";

interface TranslatedSelectProps {
  resource: string;
  source: string;
  choices: any[];
  translate: (input: string) => string;
  transLabel?: string;
}

const TranslatedSelect = withTranslate(
  ({
    source,
    choices = [1, 2, 3],
    translate,
    transLabel,
    ...rest
  }: TranslatedSelectProps) => {
    const translatedChoices = choices.map((val) => ({
      id: val,
      name: translate(
        transLabel ? `${transLabel}.${val}` : `valueTrans.${source}.${val}`
      ),
    }));

    return (
      <SelectInput source={source} choices={translatedChoices} {...rest} />
    );
  }
);

const PageTitle = withTranslate(({ translate }: any) => (
  <span>{translate(`resources.pool.create`)}</span>
));

export const SecuritiesPoolCreate = (props: any) => {
  const [security, setSecurity] = useState<Security | undefined>(undefined);

  const formName = useMemo(
    () => `FORM_NAME${Math.floor(Math.random() * (1 << 16))}`,
    []
  );

  const [spotPx, setSpotPx] = useState<number | null>(null);
  const growthRateTypes = [
    "params_revenue_growth_rate",
    "params_profit_growth_rate",
  ];

  useEffect(() => {
    change(formName, "spot_px", spotPx);
  }, [spotPx]);

  return (
    <Create title={<PageTitle />} {...props}>
      <SimpleForm
        form={formName}
        save={() => alert("save")}
        onSubmit={() => alert("submit")}
        initialValues={{ growth_rate: "params_revenue_growth_rate" }}
      >
        <PageTitle />

        <TickerPanel
          security={security}
          className="formField"
          onPxChange={setSpotPx}
        />

        <SecurityInput
          source="security"
          name="security"
          label="resources.order.fields.security"
          form={formName}
          formclassName="formField"
          autoFocus
          onSecuritySelected={setSecurity}
        />

        <TranslatedSelect
          source="params_leading_position"
          formclassName="formField"
          validate={[required()]}
        />

        <TranslatedSelect
          source="params_upside"
          formclassName="formField"
          validate={[required()]}
        />

        <TranslatedSelect
          source="params_downside_risk"
          formclassName="formField"
          validate={[required()]}
        />

        <TranslatedSelect
          source="growth_rate"
          choices={growthRateTypes}
          transLabel="resources.pool.fields"
          formclassName="formField"
          validate={[required()]}
        />

        <FormDataConsumer formclassName="formField">
          {({ formData, resource }) => (
            <NumberInput
              source={formData.growth_rate}
              resource={resource}
              formclassName="formField"
              validate={[required(), minValue(0), maxValue(100)]}
            />
          )}
        </FormDataConsumer>

        <FormDataConsumer>
          {({ formData, resource }) => {
            const {
              params_revenue_growth_rate,
              params_profit_growth_rate,
            } = formData;
            console.log(params_revenue_growth_rate, params_profit_growth_rate);
            return (
              (params_revenue_growth_rate > 0 ||
                params_profit_growth_rate > 0) && (
                <LongTextInput
                  source="params_analysis"
                  rows={3}
                  fullWidth
                  resource={resource}
                  validate={[required()]}
                />
              )
            );
          }}
        </FormDataConsumer>
      </SimpleForm>
    </Create>
  );
};

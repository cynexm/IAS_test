import {
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Dialog,
  DialogContent,
  Divider,
  Button as MuiButton
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import BigNumber from "bignumber.js";
import React from "react";
import {
  NumberField,
  Button,
  CardActions,
  Create,
  FormDataConsumer,
  ListButton,
  LongTextInput,
  maxValue,
  // tslint:disable-next-line: ordered-imports
  // Validators
  minValue,
  NumberInput,
  ReferenceInput,
  ReferenceField,
  TextField,
  required,
  SelectInput,
  SimpleForm,
  translate
} from "react-admin";
import { connect } from "react-redux";
import { change } from "redux-form";
import { never, NEVER } from "rxjs";
import { catchError } from "rxjs/operators";
import { Security, Portfolio } from "../../core/model";
import { EnvConfig } from "../../environment";
import { FxTip } from "../common/FxTip";
import { SecurityInput } from "../common/SecurityInput";
import { SimpleConfirmModal } from "../common/SimpleConfirm";
import { TickerPanel } from "../common/TickerPanel";
import { TransField } from "../common/TransField";
import storage, { Storage } from "../../core/Storage";
import {fetchApi, getSecurityType} from "../../providers/api";
import { CustomToolbar, CustomToolbar2 } from "./components/custom-toolbar/custom-toolbar"

const CreateActions = ({
  fromPos,
  purpose,
  basePath,
  data,
  resource,
  history,
  translate
}: any) => {
  return (
    <Grid container alignItems="center" justify="space-between">
      {/* 右上角标题 */}
      <Typography component="h2">
        {translate("common.create") + translate("common.order")} -{" "}
        {translate("valueTrans.purpose." + purpose)}
      </Typography>

      <CardActions>
        {fromPos ? (
          <Button label="Back" onClick={() => history.goBack()}></Button>
        ) : (
          <ListButton basePath={basePath} />
        )}
      </CardActions>
    </Grid>
  );
};

const minVal = 5000000;
const useStyles = {
  field: {
    display: "inline-block",
    minWidth: "31%",
    paddingLeft: "4px",
    paddingRight: "4px",
    whiteSpace: "nowrap"
  }
} as any;
const orderDefaultValue = {
  is_buy: true,
  is_increase: false,
  execution_type: 2,
  notional_unit: minVal
};

const { useState, useRef, useEffect } = React;

const FORM_NAME = "order-create";

const getFormName = () => `FORM_NAME${Math.floor(Math.random() * (1 << 16))}`;

const SideEffectInput = connect(
  null,
  (dispatch, props: any) => ({
    setValue: value =>
      dispatch({
        type: "@@redux-form/CHANGE",
        meta: {
          form: props.formName,
          field: props.syncFieldName,
          touch: false,
          persistentSubmitErrors: false
        },
        payload: value
      })
  })
)(({ children, setValue, ...props }: any) =>
  React.cloneElement(children, {
    ...props,
    onChange: (preventDefault, newValue, oldValue, label) => {
      setValue(new BigNumber(newValue).times(Math.pow(10, 6)).toNumber());
    }
  })
);

const SecuritySelector = ({ children, ...props }) =>
  React.cloneElement(children, {
    ...props,
    helperText:
      props.formData.security &&
      (props.choices as Security[]).find(
        choice => choice.id === props.formData.security
      )
        ? " "
        : undefined
  });

const WrappedSimpleForm = ({
  beforeSave,
  children,
  ...propsfromCreate
}: {
  beforeSave: (...params: any) => Promise<any>;
  [other: string]: any;
}) =>
  React.cloneElement(children, {
    ...propsfromCreate,
    save: (...args) => {
      console.log("onSave: ", args);
      beforeSave(...args).then(res =>
        propsfromCreate.save.apply(children, res)
      );
    }
  });

const FilteredSelect = ({
  children,
  onSelect,
  choices,
  filter,
  ...props
}: any) => {
  return React.cloneElement(children, {
    ...props,
    input: {
      ...props.input,
      onChange: onSelect
        ? v => {
            onSelect(choices.find((p: Portfolio) => p.id === v));
            props.input.onChange(v);
          }
        : props.input.onChange
    },
    choices: choices.filter(filter)
  });
};

class OrderParams {
  security: number;
  buy: number;
  sell: number;
  touch: number;
  volatility: number;
  avgValue: number;

  constructor(
    security: number,
    buy: number,
    sell: number,
    touch: number,
    volatility,
    volume
  ) {
    this.security = security;
    this.buy = buy;
    this.sell = sell;
    this.touch = touch;
    this.volatility = volatility;
    this.avgValue = volume;
  }
}

export const OrderCreate = translate(
  withStyles(useStyles)(
    ({ classes, save, permissions, translate, ...props }: any) => {

      const dialogRef = useRef<SimpleConfirmModal>(null);
      const [formName, setFormName] = useState<string>(getFormName());
      const [showTypeModal, setShowTypeModal] = useState<boolean>(false);
      const [security, setSecurity] = useState<Security | undefined>(undefined);
      const [currentP, setCurrentP] = useState<Portfolio | undefined>(
        undefined
      );
      const [position, setPosition] = useState<object | undefined>(undefined);
      const [cost, setCost] = useState<number | undefined>(27);

      const [purpose, setPurpose] = useState<string>(
        props.location.state && props.location.state.purpose
          ? props.location.state.purpose
          : "open"
      );

      const [maxVol, setMaxVol] = useState<OrderParams>({
        security: Infinity,
        buy: Infinity,
        sell: Infinity,
        touch: Infinity,
        volatility: 0,
        avgValue: 0
      });

      useEffect(() => {
        setShowTypeModal(
          !props.location.state || !props.location.state.security
        );
      }, []);

      useEffect(() => {
        // console.debug("Current P: ", security, currentP);
        const securityId = security
          ? security.id
          : props.location.state && props.location.state.security
          ? props.location.state.security
          : undefined;
        const portfolioId = currentP
          ? currentP.id
          : props.location.state && props.location.state.portfolio
          ? props.location.state.portfolio
          : undefined;

        if (!securityId || !portfolioId) {
          return;
        }
        fetchApi<{ msg: any }>(
          EnvConfig.Apis.maxVol(securityId, portfolioId)
        ).then(r => {
          setMaxVol({
            security: r.msg.security_limit,
            buy: r.msg.buy,
            sell: r.msg.sell,
            touch: r.msg.touch_limit,
            volatility: r.msg.security_volatility,
            avgValue: r.msg.security_avg_value
          });

          if (purpose !== "other") {
            setPosition(r.msg.position);
          }
        });
      }, [security, currentP]);

      const fromPos = props.location.state && !!props.location.state.pos;

      const COST_FLOOR = 0.001;
      const OTHER_COST = 0.0007;

      const findPurpose = formProps => {
        if (position !== undefined) {
          (position["side"] === 1) === formProps.formData.is_buy
            ? setPurpose("add")
            : position["notional_unit"] === formProps.formData.notional_unit
            ? setPurpose("close")
            : setPurpose("reduce");
        }
        // trading_cost = const * daily_volatility * np.sqrt(trading_value/aver_daily_volume);
        // final_trading_cost = max(trading_cost, impact_cost_floor) + other_costs
        if (
          formProps.formData.execution_type &&
          formProps.formData.notional_unit &&
          maxVol.avgValue > 0
        ) {
          const raw = formProps.formData.execution_type === 1 ? 1.0 : 0.5;
          console.debug("RAW", raw);
          let costRaw =
            raw *
            maxVol.volatility *
            Math.sqrt(formProps.formData.notional_unit / maxVol.avgValue);
          setCost(
            Math.round(10000 * (Math.max(costRaw, COST_FLOOR) + OTHER_COST))
          );
        }
      };

      // IAS 二期需求开发 ===========================
      const [isBotxTicker, setIsBotxTicker] = useState<boolean>(false)

      const securitySelected = (e) => {
        setSecurity(e)

        setIsBotxTicker(false)

        // 获取股票类型是否是 box 如果是，并给出相关提示，并禁用保存按钮
        getSecurityType(e.ticker).then((res: any) => {
          console.log('getSecurityType >> ', res)
          if (res.botx === 1) {
            setIsBotxTicker(true)
          } else {
            setIsBotxTicker(false)
          }
        }).catch(err => {
          console.error('getSecurityType >> ', err)
          setIsBotxTicker(false)
        })

      }

      return (
        <>
          <Create
            actions={
              <CreateActions
                fromPos={fromPos}
                purpose={purpose}
                translate={translate}
                {...props}
              />
            }
            {...props}
          >
            <WrappedSimpleForm
              beforeSave={(...args) => {
                return new Promise(
                  resolve =>
                    dialogRef &&
                    dialogRef.current &&
                    dialogRef.current
                      .showModal(args)
                      .pipe(
                        catchError(err => {
                          console.error("CREATE ERROR", err);
                          return NEVER;
                        })
                      )
                      .subscribe(args => resolve(args))
                );
              }}
              redirect={(basePath, id, data) => {
                return `/order/${id}/show`;
              }}
            >
              <SimpleForm
                form={formName}
                defaultValue={{
                  ...orderDefaultValue,
                  ...(props.location.state || {})
                }}
                toolbar={ isBotxTicker ? <CustomToolbar2 /> : <CustomToolbar />}
              >
                <TickerPanel security={security} />

                {/* 投资资产 */}
                {props.location.state && props.location.state.security ? (
                  <ReferenceInput
                    label={translate("common.asset")}
                    source="security"
                    reference="securities"
                    validate={[required()]}
                    disabled={fromPos}
                    formClassName={classes.field}
                  >
                    <FormDataConsumer form={formName}>
                      {formProps => (
                        <SecuritySelector {...formProps}>
                          <SelectInput
                            label={translate("common.asset")}
                            optionText="name"
                          />
                        </SecuritySelector>
                      )}
                    </FormDataConsumer>
                  </ReferenceInput>
                ) : (
                  <SecurityInput
                    source="security"
                    name="security"
                    label="resources.order.fields.security"
                    form={formName}
                    formClassName={classes.field}
                    autoFocus={!fromPos}
                    onSecuritySelected={securitySelected}
                  />
                )}
                {/* 模拟组合 */}
                <ReferenceInput
                  source="portfolio"
                  reference="portfolio"
                  label="resources.order.fields.portfolio"
                  disabled={fromPos}
                  formClassName={classes.field}
                  validate={[required()]}
                >
                  <FilteredSelect
                    filter={(p: Portfolio) =>
                      permissions !== "vpm" ||
                      !!p.managers.find(
                        m =>
                          m.username === storage.get(Storage.Keys.AuthUser) &&
                          m.is_admin
                      )
                    }
                    onSelect={setCurrentP}
                  >
                    <SelectInput
                      optionText={(p: Portfolio) => <div>{p.name}</div>}
                    />
                  </FilteredSelect>
                </ReferenceInput>

                {/* 交易方向 */}
                <FormDataConsumer form={formName} formClassName={classes.field}>
                  {formProps => (
                    <SelectInput
                      optionText="name"
                      optionValue="value"
                      source="is_buy"
                      label="resources.order.fields.is_buy"
                      choices={[
                        {
                          name: translate("valueTrans.isBuy.buy"),
                          value: true
                        },
                        {
                          name: translate("valueTrans.isBuy.sell"),
                          value: false
                        }
                      ]}
                      options={{
                        disabled: purpose === "other" ? false : fromPos
                      }}
                      formClassName={classes.field}
                      validate={[required()]}
                      onChange={findPurpose(formProps)}
                    />
                  )}
                </FormDataConsumer>

                <FormDataConsumer form={formName} formClassName={classes.field}>
                  {formProps => (
                    <NumberInput
                      source="notional_unit"
                      label="resources.order.fields.notional_unit"
                      disabled={
                        props.location.state &&
                        props.location.state.notional_unit
                      }
                      options={{
                        autoFocus: fromPos,
                        inputProps: {
                          step: security && security.currency === "USD" ? 1 : 5
                        }
                      }}
                      format={v =>
                        v ? new BigNumber(v).div(Math.pow(10, 6)).toNumber() : v
                      }
                      parse={v =>
                        new BigNumber(v).times(Math.pow(10, 6)).toNumber() ||
                        null
                      }
                      InputProps={{
                        endAdornment: (
                          <span style={{ lineHeight: "32px" }}>
                            {translate("common.million")}(M)
                          </span>
                        )
                      }}
                      helperText={
                        formProps.formData.notional_unit % minVal !== 0 ? (
                          <span style={{ color: "red" }}>
                            {translate("common.divisible")}
                          </span>
                        ) : formProps.formData.notional_unit >
                          (formProps.formData.is_buy
                            ? maxVol.buy
                            : maxVol.sell) ? (
                          <span style={{ color: "red" }}>
                            {translate("common.exceed") +
                              translate("common.positions") +
                              translate("common.limit")}
                            {formProps.formData.is_buy
                              ? `${translate(
                                  "valueTrans.isBuy.buy"
                                )}:${maxVol.buy / 1000000}M`
                              : `${translate(
                                  "valueTrans.isBuy.sell"
                                )}:${maxVol.sell / 1000000}M`}
                          </span>
                        ) : formProps.formData.notional_unit >
                          maxVol.security ? (
                          <span style={{ color: "orange" }}>
                            {translate("common.exceed") +
                              translate("common.asset") +
                              translate("common.limit")}
                            ：
                            {(formProps.formData.execution_type === 1
                              ? maxVol.touch
                              : maxVol.security) / 1000000}
                            M
                          </span>
                        ) : maxVol.security !== Infinity ? (
                          <span>
                            {translate("common.asset") +
                              translate("common.limit")}
                            :
                            {(formProps.formData.execution_type === 1
                              ? maxVol.touch
                              : maxVol.security) / 1000000}
                            M{" "}
                            {translate("common.positions") +
                              translate("common.limit")}
                            {formProps.formData.is_buy
                              ? `${translate(
                                  "valueTrans.isBuy.buy"
                                )}:${maxVol.buy / 1000000}M`
                              : `${translate(
                                  "valueTrans.isBuy.sell"
                                )}:${maxVol.sell / 1000000}M`}
                          </span>
                        ) : null
                      }
                      formClassName={classes.field}
                      validate={[
                        required(),
                        minValue(minVal),
                        maxValue(
                          formProps.formData.is_buy ? maxVol.buy : maxVol.sell,
                          translate("common.exceed") + translate("common.limit")
                        ),
                        (value, allValues) =>
                          value % minVal !== 0
                            ? translate("common.divisible")
                            : undefined
                      ]}
                    />
                  )}
                </FormDataConsumer>

                {permissions !== "vpm" && (
                  <ReferenceInput
                    source="user"
                    reference="users"
                    formClassName={classes.field}
                    validate={[required()]}
                    perPage={5000}
                  >
                    <FilteredSelect filter={user => !user.is_staff}>
                      <SelectInput optionText="username" optionValue="id" />
                    </FilteredSelect>
                  </ReferenceInput>
                )}

                {/*<ExecutionTypeSelector*/}
                {/*  source="execution_type"*/}
                {/*  formClassName={classes.field}*/}
                {/*  validate={[required()]}*/}
                {/*/>*/}

                <SelectInput
                  source="execution_type"
                  choices={[
                    { id: 2, name: "VWAP" },
                    {
                      id: 1,
                      name: "TOUCH",
                      disabled: maxVol.touch === Infinity || maxVol.touch === 0
                    }
                  ]}
                  formClassName={classes.field}
                  validate={[required()]}
                  helperText={
                    <span>
                      {translate("common.estimated_cost")}: ~{cost}bps
                    </span>
                  }
                />

                {/* <TextInput source="trx_purpose" formClassName={classes.field} /> */}
                <LongTextInput source="reason_txt" />
                <FxTip
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#fff9f0",
                    padding: "10px",
                    marginTop: "10px"
                  }}
                  security={security}
                />
              </SimpleForm>
            </WrappedSimpleForm>
          </Create>


          {/* Confirm Modal */}
          <SimpleConfirmModal
            ref={dialogRef}
            onClose={(isOk, data) => void 0}
            tip="是否确认创建？"
          >
            <FormDataConsumer form={formName}>
              {formProps => {
                return (
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          {translate("resources.order.fields.portfolio")}
                        </TableCell>
                        <TableCell>
                          <ReferenceField
                            linkType={null}
                            basePath="/portfoliolist"
                            record={formProps.formData}
                            source="portfolio"
                            reference="portfoliolist"
                            perPage={5000}
                          >
                            <TextField source="name" />
                          </ReferenceField>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          {translate("resources.order.fields.security")}
                        </TableCell>
                        <TableCell>
                          <ReferenceField
                            basePath="/order"
                            linkType={false}
                            record={formProps.formData}
                            source="security"
                            reference="securities"
                          >
                            <TextField source="name" />
                          </ReferenceField>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          {translate("resources.order.fields.is_buy")}
                        </TableCell>
                        <TableCell>
                          <TransField
                            label="Side"
                            // headerClassName={classes.centerHeader}
                            record={formProps.formData}
                            source="is_buy"
                            // align="center"
                            transKey="valueTrans.isBuy"
                            keyInter={isBuy => (isBuy ? "buy" : "sell")}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          {translate("resources.order.fields.notional_unit")}
                        </TableCell>
                        <TableCell>
                          <NumberField
                            record={formProps.formData}
                            source="notional_unit"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          {translate(
                            "resources.order.fields.existing_notional"
                          )}
                        </TableCell>
                        <TableCell>
                          <NumberField
                            record={position}
                            source="notional_unit"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          {translate("resources.order.fields.trx_purpose")}
                        </TableCell>
                        <TableCell>
                          <span>{purpose}</span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                );
              }}
            </FormDataConsumer>
          </SimpleConfirmModal>


          {/* SetType Modal */}
          <Dialog open={showTypeModal}>
            <h3 style={{ textAlign: "center" }}>
              {translate("common.idea_type_title")}
            </h3>
            <Divider style={{ marginBottom: "16px" }}></Divider>

            <DialogContent>
              {// Object.entries(DictEn.valueTrans.ideaType)
              [0, 1, 2].map(indexNum => (
                <div style={{ margin: "12px" }}>
                  <FormDataConsumer form={formName}>
                    {({ dispatch }) => (
                      <MuiButton
                        variant="outlined"
                        size="large"
                        fullWidth
                        color="secondary"
                        key={indexNum}
                        // label={o.name}
                        onClick={() => {
                          dispatch(change(formName, "idea_type", indexNum));
                          setShowTypeModal(false);
                        }}
                      >
                        {translate("valueTrans.ideaType." + indexNum)}
                      </MuiButton>
                    )}
                  </FormDataConsumer>
                </div>
              ))}
            </DialogContent>
          </Dialog>
        </>
      );
    }
  )
);

import {Grid, InputAdornment, Typography} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";

import BigNumber from "bignumber.js";
import React from "react";
import {
  BooleanInput,
  Button,
  CardActions,
  choices,
  Create,
  DisabledInput,
  email,
  FormDataConsumer,
  ListButton,
  LongTextInput,
  maxLength,
  maxValue,
  minLength,
  // tslint:disable-next-line: ordered-imports
  // Validators
  minValue,
  number,
  NumberInput,
  ReferenceInput,
  regex,
  required,
  SelectInput,
  SimpleForm,
  TextInput
} from "react-admin";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {change} from "redux-form";
import {never, NEVER} from "rxjs";
import {catchError} from "rxjs/operators";
import {Security} from "../../core/model";
import {EnvConfig} from "../../environment";
import {CurrencySelector} from "../common/CurrencySelector";
import {ExecutionTypeSelector} from "../common/ExecutionTypeSelector";
import {FxTip} from "../common/FxTip";
import {SecurityInput} from "../common/SecurityInput";
import {SimpleConfirmModal} from "../common/SimpleConfirm";
import {TickerPanel} from "../common/TickerPanel";
import {InstituteButton} from "./InstituteCreate";

const CreateTitle = () => (
  <Typography component="h2">Create New User</Typography>
);
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
  is_buy: false,
  is_increase: false,
  execution_type: 1
};

const {useState, useRef} = React;

const FORM_NAME = "user-create";

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
      beforeSave(...args).then(res =>
        propsfromCreate.save.apply(children, res)
      );
    }
  });

export const UserCreate = withStyles(useStyles)(
  ({classes, save, ...props}: any) => {
    console.debug("Router Params: ", props.match.params);
    const dialogRef = useRef<SimpleConfirmModal>(null);
    const [security, setSecurity] = useState<Security | undefined>(undefined);
    const fromPos = props.location.state && !!props.location.state.pos;
    return (
      <>
        <Create {...props}>
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
                        console.error(err);
                        return NEVER;
                      })
                    )
                    .subscribe(args => resolve(args))
                // return Promise.resolve(args);
              );
            }}
          >
            <SimpleForm form={FORM_NAME} redirect="list" {...props}>
              <TextInput
                source="username"
                validate={[required(), minLength(3)]}
              />
              <TextInput
                type="password"
                source="password"
                validate={[required(), minLength(6)]}
              />
              <TextInput source="email" validate={[required(), email()]}/>
              <TextInput
                source="first_name"
                validate={[required(), minLength(1)]}
              />
              <TextInput
                source="last_name"
                validate={[required(), minLength(1)]}
              />
              <ReferenceInput source="institute" reference="institutes">
                <SelectInput optionText="name"/>
              </ReferenceInput>

              <InstituteButton className={classes.field}/>

              {/* 内部账号 */}
              <BooleanInput
                defaultValue={false}
                source="is_intlacc"
                validate={[required()]}
              />

              {/* 管理员账号 */}
              <BooleanInput
                defaultValue={false}
                source="is_staff"
                validate={[required()]}
              />
            </SimpleForm>
          </WrappedSimpleForm>
        </Create>
        <SimpleConfirmModal
          ref={dialogRef}
          onClose={(isOk, data) => void 0}
          tip="确认要增加该用户？"
        />
      </>
    );
  }
);

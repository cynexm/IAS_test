import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { AddToQueue } from "@material-ui/icons";
import * as PropTypes from "prop-types";
import React from "react";
import {
  Button,
  choices,
  email,
  maxLength,
  maxValue,
  minLength,
  // tslint:disable-next-line: ordered-imports
  // Validators
  minValue,
  number,
  NumberInput,
  regex,
  required,
  showNotification,
  SimpleForm,
  TextInput,
  Toolbar,
  SaveButton,
  UPDATE,
  GET_LIST,
  withDataProvider,
  userLogout as userLogoutAction
} from "react-admin";
import { push } from "react-router-redux";
import { SimpleConfirmModal } from "../common/SimpleConfirm";
import { Drawer } from "@material-ui/core";
import storage, { Storage } from "../../core/Storage";
const styles = {
  field: {
    display: "inline-block",
    minWidth: "31%",
    paddingLeft: "4px",
    paddingRight: "4px",
    whiteSpace: "nowrap"
  }
} as any;
const { useRef, useEffect } = React;
const DrawToolbar = ({ onClose, ...props }) => (
  <Toolbar {...props}>
    <SaveButton />
    <Button size="large" label="取消" onClick={onClose}></Button>
  </Toolbar>
);
const SetPasswordForm = withStyles(styles)(
  ({ dataProvider, dispatch, classes, onUpdateSuccess, ...props }: any) => {
    const dialogRef = useRef<SimpleConfirmModal>(null);
    const [id, setUser] = useState<number | undefined>(undefined);

    useEffect(() => {
      dataProvider(GET_LIST, "users")
        .then(res => res.data)
        .then(users =>
          setUser(
            (users.find(
              user => user.username === storage.get(Storage.Keys.AuthUser)
            ) || {})["id"]
          )
        );
    }, []);
    const handleSubmit = data => {
      dataProvider(UPDATE, "users", {
        id,
        data,
        action: "set_password"
      })
        .then(() => {
          dispatch(
            showNotification(
              "Set password success. Please relogin with the new password",
              "success"
            )
          );
          setTimeout(() => {
            onUpdateSuccess();
            dispatch(userLogoutAction("/login"));
          }, 500);
        })
        .catch(e => {
          console.error("E: ", e);
          dispatch(
            showNotification(
              "Error: Set password failed, please check whether your old password is currect",
              "warning"
            )
          );
        });
    };

    return (
      <>
        <SimpleForm
          form="SetPasswordForm"
          save={data =>
            dialogRef && dialogRef.current && dialogRef.current.showModal(data)
          }
          toolbar={<DrawToolbar onClose={onUpdateSuccess} />}
          {...props}
        >
          <TextInput
            type="password"
            source="old_password"
            validate={[required()]}
          />
          <TextInput
            type="password"
            source="new_password"
            validate={[required(), minLength(8)]}
          />
          <TextInput
            type="password"
            source="confirm"
            validate={[
              required(),
              (value, allValues) => {
                console.debug("ALlValues: ", allValues);
                if (value && value !== allValues.new_password) {
                  return "两次密码输入不一致";
                }
                return null;
              }
            ]}
          />
        </SimpleForm>
        <SimpleConfirmModal
          ref={dialogRef}
          onClose={(isOk, data) => (isOk ? handleSubmit(data) : void 0)}
          tip="确认更新密碼"
        />
      </>
    );
  }
);

SetPasswordForm.propTypes = {
  dataProvider: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  push: PropTypes.func,
  record: PropTypes.object,
  showNotification: PropTypes.func
};

const SetPasswordFormWrapper = withDataProvider(SetPasswordForm);
export { SetPasswordFormWrapper as SetPasswordForm };
const { useState } = React;
export const SetPasswordTrigger = ({ onClick, ...props }) => {
  return <Button label="设置密码" onClick={onClick} {...props}></Button>;
};
export default SetPasswordTrigger;

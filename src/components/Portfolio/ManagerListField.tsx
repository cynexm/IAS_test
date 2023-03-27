import { Chip, createStyles, Drawer, withStyles } from "@material-ui/core";
import classnames from "classnames";
import get from "lodash/get";
import * as PropTypes from "prop-types";
import React from "react";
import {
  BooleanInput,
  CREATE,
  DELETE,
  GET_LIST,
  GET_ONE,
  ReferenceInput,
  required,
  SelectInput,
  showNotification,
  SimpleForm,
  withDataProvider,
} from "react-admin";

import { Portfolio, User } from "../../core/model";
import { SimpleConfirmModal } from "../common/SimpleConfirm";
const { useState, useRef } = React;
const chipStyles = createStyles((theme) => ({
  chip: {
    margin: `0 ${theme.spacing.unit * 0.5}px`,
  },
  field: {
    display: "inline-block",
    minWidth: "31%",
    paddingLeft: "4px",
    paddingRight: "4px",
    whiteSpace: "nowrap",
  },
})) as any;

const AddFmForm = withDataProvider(
  withStyles(chipStyles)(
    (() => {
      const AddFmForm = ({
        classes,
        dataProvider,
        dispatch,
        onSubmit,
        onClose,
        record,
        ...props
      }) => {
        const dialogRef = useRef<SimpleConfirmModal>(null);
        return (
          <>
            <SimpleForm
              save={(data) =>
                dialogRef &&
                dialogRef.current &&
                dialogRef.current.showModal(data)
              }
              defaultValue={{
                is_admin: false,
              }}
              {...props}
            >
              <ReferenceInput
                source="user"
                reference="users"
                formClassName={classes.field}
                validate={[required()]}
              >
                <SelectInput optionText="username" />
              </ReferenceInput>
              <BooleanInput
                formClassName={classes.field}
                source="is_admin"
                validate={[required()]}
              />
            </SimpleForm>
            <SimpleConfirmModal
              ref={dialogRef}
              onClose={(isOk, data) => (isOk ? onSubmit(data) : void 0)}
              tip="确认要增加该用户作为投资组合管理人?"
            />
          </>
        );
      };
      AddFmForm.propTypes = {
        dataProvider: PropTypes.func.isRequired,
        dispatch: PropTypes.func.isRequired,
        record: PropTypes.object,
      };
      return AddFmForm;
    })()
  )
);

export const ManagerListField: any = withDataProvider(
  withStyles(chipStyles)(
    (() => {
      const ChipList = ({
        record,
        classes,
        dataProvider,
        onlyForDisplay = false,
        dispatch,
        ...props
      }: {
        record?: Portfolio;
        [other: string]: any;
      }) => {
        const [showFmDrawer, setShowFmDrawer] = useState(false);
        const dialogRef = useRef<SimpleConfirmModal>(null);

        const deleteFm = (id: string | number) => {
          dataProvider(DELETE, "portfoliomanager", { id })
            .then((res) => {
              dispatch(showNotification("更新成功", "success"));
              dataProvider(GET_ONE, "portfolio", { id: record && record.id });
            })
            .catch((e) => {
              console.error("Error: ", e);
              dispatch(showNotification("Error: 更新管理员失败", "warning"));
            });
        };
        const addFm = ({ is_admin, user }: { is_admin: boolean; user }) => {
          console.debug("USER: ", user);
          dataProvider(CREATE, "portfoliomanager", {
            data: {
              is_admin,
              portfolio: record && record.id,
              user,
            },
          })
            .then((res) => {
              dispatch(showNotification("更新成功", "success"));
              dataProvider(GET_ONE, "portfolio", { id: record && record.id });
            })
            .catch((e) => {
              console.error("Error: ", e);
              dispatch(showNotification("Error: 更新管理员失败", "warning"));
            })
            .then(() => setShowFmDrawer(false));
        };
        return (
          <ul
            style={{
              display: "flex",
              listStyle: "none",
              padding: "unset",
              margin: "unset",
            }}
          >
            {record &&
              record.managers &&
              record.managers.length !== 0 &&
              record.managers.map((m, i) => (
                <li key={i}>
                  <Chip
                    className={classnames(classes.chip, props.className)}
                    color={m.is_admin ? "primary" : "default"}
                    label={m.username}
                    onDelete={
                      onlyForDisplay
                        ? undefined
                        : () =>
                            dialogRef &&
                            dialogRef.current &&
                            dialogRef.current.showModal(m.id)
                    }
                  ></Chip>
                </li>
              ))}
            {!onlyForDisplay && (
              <Chip
                className={classnames(classes.chip, props.className)}
                label="+"
                clickable={!onlyForDisplay}
                onClick={
                  !onlyForDisplay ? () => setShowFmDrawer(true) : undefined
                }
              ></Chip>
            )}
            <Drawer
              anchor="bottom"
              open={showFmDrawer}
              onClose={() => setShowFmDrawer(false)}
            >
              <AddFmForm
                onClose={() => setShowFmDrawer(false)}
                record={record}
                onSubmit={addFm}
                {...props}
              />
            </Drawer>
            <SimpleConfirmModal
              ref={dialogRef}
              onClose={(isOk, data) => (isOk ? deleteFm(data) : void 0)}
              tip="确认要删除该Fundmanager?"
            />
          </ul>
        );
      };
      ChipList.propTypes = {
        dataProvider: PropTypes.func.isRequired,
        dispatch: PropTypes.func.isRequired,
        record: PropTypes.object,
        showNotification: PropTypes.func,
      };
      return ChipList;
    })()
  )
);
ManagerListField.defaultProps = { addLabel: true };

export default ManagerListField;

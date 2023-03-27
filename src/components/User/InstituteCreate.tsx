import { Chip, createStyles, Drawer, withStyles, IconButton } from "@material-ui/core";
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
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
  required,
  TextInput,
  showNotification,
  SimpleForm,
  withDataProvider
} from "react-admin";
import { withRouter } from "react-router";
import { Portfolio, User } from "../../core/model";
import { SimpleConfirmModal } from "../common/SimpleConfirm";
const { useState, useRef } = React;

const styles = {
    field: {
      display: "inline-block",
      minWidth: "31%",
      paddingLeft: "4px",
      paddingRight: "4px",
      whiteSpace: "nowrap"
    }
  } as any;

const AddInstituteForm = withStyles(styles)(
    ({ classes, onSubmit, onClose, ...props }: any) => {
        console.debug("create props", props);
        const dialogRef = useRef<SimpleConfirmModal>(null);
        return (
          <>
            <SimpleForm
              save={data =>
                dialogRef &&
                dialogRef.current &&
                dialogRef.current.showModal(data)
              }
            >
              <TextInput formClassName={classes.field}
                source="name"
                validate={[required()]
                }></TextInput>
              <TextInput formClassName={classes.field}
                source="name_ch"
                validate={[required()]
                }></TextInput>
            </SimpleForm>
            <SimpleConfirmModal
              ref={dialogRef}
              onClose={(isOk, data) => (isOk ? onSubmit(data) : void 0)}
              tip="确认要增加该机构?"
            />
          </>
        );
    }
);

export const InstituteButton: any = withDataProvider(
    (() => {
      const ChipList = ({
        classes,
        dataProvider,
        dispatch,
        ...props
      }: any ) => {
        const [showInsDrawer, setShowInsDrawer] = useState(false);
        const dialogRef = useRef<SimpleConfirmModal>(null);

        const addIns = ({ name, name_ch }: any) => {
          dataProvider(CREATE, "institutes", {
            data: {
                name,
                name_ch
            }
          })
            .then(res => {
                dispatch(showNotification("更新成功", "success"));
                dataProvider(GET_LIST, "institutes");
            })
            .catch(e => {
              console.error("Error: ", e);
              dispatch(showNotification("Error: 失败", "warning"));
            })
            .then(() => setShowInsDrawer(false));
        };
        return (
          <>
            <IconButton color="secondary" onClick={() => setShowInsDrawer(true)}>
                <PlaylistAddIcon />
            </IconButton>
      
            <Drawer
              anchor="bottom"
              open={showInsDrawer}
              onClose={() => setShowInsDrawer(false)}
            >
              <AddInstituteForm
                onClose={() => setShowInsDrawer(false)}
                onSubmit={addIns}
                {...props}
              />
            </Drawer>
          </>
        );
      };
      ChipList.propTypes = {
        dataProvider: PropTypes.func.isRequired,
        dispatch: PropTypes.func.isRequired,
        showNotification: PropTypes.func
      };
      return ChipList;
    })()

);

export default InstituteButton;

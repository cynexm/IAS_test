import { withStyles } from "@material-ui/core/styles";
import { AddToQueue } from "@material-ui/icons";
import * as PropTypes from "prop-types";
import React, { useRef } from "react";
import {
  Button,
  minValue,
  NumberInput,
  SimpleForm,
  UPDATE,
  withDataProvider,
  LongTextInput
} from "react-admin";
import { SimpleConfirmModal } from "../common/SimpleConfirm";
import BigNumber from "bignumber.js";

export const formStyles = {
  field: {
    display: "inline-block",
    minWidth: "31%",
    paddingLeft: "4px",
    paddingRight: "4px",
    whiteSpace: "nowrap"
  }
} as any;

const FillForm = withStyles(formStyles)(
  ({
    dataProvider,
    dispatch,
    classes,
    id,
    onUpdateSuccess,
    record,
    ...props
  }: any) => {
    const dialogRef = useRef<SimpleConfirmModal>(null);

    const handleSubmit = data => {
      // dataProvider(UPDATE, "order", {
      //   id,
      //   data,
      //   action: "override"
      // })
      //   .then(() => {
      //     onUpdateSuccess();
      //     dispatch(showNotification("Order Overrided", "success"));
      //   })
      //   .catch(e => {
      //     dispatch(showNotification("Error: Parameter missing", "warning"));
      //   });
      dataProvider(
        UPDATE,
        "order",
        { id, data, action: "override" },
        {
          onSuccess: {
            notification: { body: "notification.overrided", level: "info" },
            refresh: true,
            callback: onUpdateSuccess
          },
          onFailure: {
            notification: { body: "notification.error", level: "warning" }
          }
        }
      );
    };

    return (
      <>
        <SimpleForm
          save={data =>
            dialogRef && dialogRef.current && dialogRef.current.showModal(data)
          }
          defaultValue={{
            avg_fill_price: record.execution.avg_fill_price,
            cost: record.execution.cost,
            admin_note: record.admin_note,
            approved_unit: record.execution.approved_unit
          }}
        >
          <NumberInput
            source="avg_fill_price"
            validate={[minValue(1)]}
            formClassName={classes.field}
            // defaultValue={record.execution.avg_fill_price}
          />
          <NumberInput
            source="approved_unit"
            validate={[minValue(1)]}
            formClassName={classes.field}
            options={{
              inputProps: { step: 5 }
            }}
            defaultValue={record.execution.approved_unit}
            format={v =>
              v ? new BigNumber(v).div(Math.pow(10, 6)).toNumber() : v
            }
            parse={v => new BigNumber(v).times(Math.pow(10, 6)).toNumber()}
            InputProps={{
              endAdornment: (
                <span style={{ lineHeight: "32px" }}>Million(s)</span>
              )
            }}
          />
          <NumberInput
            formClassName={classes.field}
            source="cost"
            validate={[minValue(1)]}
            // defaultValue={record.execution.cost}
          />

          <LongTextInput source="admin_note" />
        </SimpleForm>
        <SimpleConfirmModal
          ref={dialogRef}
          onClose={(isOk, data) => (isOk ? handleSubmit(data) : void 0)}
          tip="确认编辑此订单"
        />
      </>
    );
  }
);

FillForm.propTypes = {
  dataProvider: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  push: PropTypes.func,
  record: PropTypes.object,
  showNotification: PropTypes.func
};

const FillFormWrapper = withDataProvider(FillForm);
export { FillFormWrapper as FillForm };
export default FillForm;

export const FillTrigger = ({ onClick, ...props }) => (
  <Button label="actions.override" onClick={onClick} {...props}>
    <AddToQueue />
  </Button>
);

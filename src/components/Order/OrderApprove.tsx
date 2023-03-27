import Check from "@material-ui/icons/Check";
import BigNumber from "bignumber.js";
import * as PropTypes from "prop-types";
import React from "react";
import {
  Button,
  LongTextInput,
  NumberInput,
  SimpleForm,
  UPDATE,
  withDataProvider, SelectInput
} from "react-admin";
import { push } from "react-router-redux";
import { formStyles } from "./OrderFill";
import { withStyles } from "@material-ui/core/styles";

const ApproveForm = ({
  dataProvider,
  dispatch,
  onUpdateSuccess,
  record,
  ...props
}) => {
  const handleSubmit = data => {
    // dataProvider(UPDATE, "tm", {
    //   id: record.id,
    //   data: {
    //     notional: data.notional_unit,
    //     request_notional: record.notional_unit
    //   },
    //   action: "approve"
    // })
    //   .then(() => {
    //     onUpdateSuccess();
    //     dispatch(showNotification("Order approved"));
    //     dispatch(push("/order"));
    //   })
    //   .catch(e => {
    //     dispatch(showNotification("Error: Order not approved", "warning"));
    //   });
    dataProvider(
      UPDATE,
      "tm",
      {
        id: record.id,
        data: {
          ...data,
          request_notional: record.notional_unit
        },
        action: "approve"
      },
      {
        onSuccess: {
          notification: { body: "notification.approved", level: "info" },
          redirectTo: "/order"
        },
        onFailure: {
          notification: { body: "notification.error", level: "warning" }
        }
      }
    );
  };

  return (
    <SimpleForm save={value => handleSubmit(value)} {...props}>
      <NumberInput
        source="notional_unit"
        options={{
          defaultValue: new BigNumber(record.notional_unit)
            .div(Math.pow(10, 6))
            .toNumber(),
          inputProps: { step: 5 }
        }}
        format={v => (v ? new BigNumber(v).div(Math.pow(10, 6)).toNumber() : v)}
        parse={v => new BigNumber(v).times(Math.pow(10, 6)).toNumber()}
        InputProps={{
          endAdornment: <span style={{ lineHeight: "32px" }}>Million(s)</span>
        }}
      />

      <SelectInput
        source="execution_type"
        choices={[
          { id: 2, name: "VWAP" },
          {
            id: 1,
            name: "TOUCH"
          }
        ]}
        defaultValue={record.execution_type}
      />

      <LongTextInput source="admin_note" />
    </SimpleForm>
  );
};

ApproveForm.propTypes = {
  dataProvider: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  push: PropTypes.func,
  record: PropTypes.object,
  showNotification: PropTypes.func
};

const ApproveFormWrapper = withDataProvider(ApproveForm);
export { ApproveFormWrapper as ApproveForm };
export default ApproveFormWrapper;
export const ApproveTrigger = ({ onClick, ...props }) => (
  <Button label="actions.approve" onClick={onClick} {...props}>
    <Check />
  </Button>
);

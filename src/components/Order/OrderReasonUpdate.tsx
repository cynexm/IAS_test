import BorderColorIcon from "@material-ui/icons/BorderColor";
import * as PropTypes from "prop-types";
import React from "react";
import {
  Button,
  LongTextInput,
  SimpleForm,
  UPDATE,
  withDataProvider,
} from "react-admin";

const ReasonUpdateForm = ({
  dataProvider,
  dispatch,
  id,
  record,
  onUpdateSuccess,
  permissions,
  ...props
}) => {
  console.debug("Update Reason: ", id, record, props);
  const handleSubmit = (data) => {
    dataProvider(
      UPDATE,
      "order",
      {
        id,
        data,
        action: "update_reason",
      },
      {
        onSuccess: {
          notification: { body: "notification.updated", level: "info" },
          refresh: true,
          callback: onUpdateSuccess,
        },
        onFailure: {
          notification: { body: "notification.error", level: "warning" },
        },
      }
    );
  };

  return (
    <SimpleForm save={(value) => handleSubmit(value)} {...props}>
      <LongTextInput
        source={permissions === "apm" ? "reason" : "reason_txt"}
        label="resources.order.fields.reason"
        options={{
          defaultValue:
            permissions === "apm" && !!record.reason
              ? record.reason
              : record.reason_txt,
          autoFocus: true,
        }}
      />
    </SimpleForm>
  );
};

ReasonUpdateForm.propTypes = {
  dataProvider: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  push: PropTypes.func,
  record: PropTypes.object,
  showNotification: PropTypes.func,
};

const ReasonUpdateFormWrapper = withDataProvider(ReasonUpdateForm);
export { ReasonUpdateFormWrapper as ReasonUpdateForm };
export default ReasonUpdateForm;

export const ReasonUpdateTrigger = ({ onClick, ...props }) => (
  <Button label="actions.update" onClick={onClick} {...props}>
    <BorderColorIcon />
  </Button>
);

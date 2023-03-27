import React from "react";
import {
  UPDATE,
  SelectInput,
  SimpleForm,
  withDataProvider,
  REDUX_FORM_NAME,
} from "react-admin";
import { reset } from "redux-form";

const ParamUpdateForm = ({
  dataProvider,
  record,
  onUpdateSuccess,
  dispatch,
  ...props
}) => {
  const { urgency, admin_rating } = record;
  const params = { urgency, admin_rating };

  const handleSubmit = (data) => {
    dataProvider(
      UPDATE,
      "portfolio",
      {
        id: record.id,
        data,
        action: "adjust_rating",
      },
      {
        onSuccess: {
          notification: { body: "notification.paramupdated", level: "info" },
          //refresh: true,
          callback: onUpdateSuccess,
        },
        onFailure: {
          notification: { body: "notification.error", level: "warning" },
        },
      }
    ).then(() => {
      setTimeout(() => dispatch(reset(REDUX_FORM_NAME)), 500);
    });
  };

  return (
    <SimpleForm save={(values) => handleSubmit(values)} record={params}>
      <SelectInput
        source="urgency"
        label="urgency"
        choices={[
          { id: -1, name: "-1" },
          { id: 0, name: "0" },
          { id: 1, name: "1" },
        ]}
        translateChoice={false}
      />
      <SelectInput
        source="admin_rating"
        label="admin_rating"
        choices={[
          { id: -1, name: "-1" },
          { id: 0, name: "0" },
          { id: 1, name: "1" },
        ]}
        translateChoice={false}
      />
    </SimpleForm>
  );
};

export default withDataProvider(ParamUpdateForm);

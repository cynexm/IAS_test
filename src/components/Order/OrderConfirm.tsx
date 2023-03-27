import Check from "@material-ui/icons/Check";
import * as PropTypes from "prop-types";
import React from "react";
import {
  Button,
  UPDATE,
  withDataProvider
} from "react-admin";
import { push } from "react-router-redux";
import { SimpleConfirmModal } from "../common/SimpleConfirm";
import { catchError } from "rxjs/operators";
import { NEVER } from "rxjs";
const { useRef } = React;
const ConfirmButton = ({ dataProvider, dispatch, record, onUpdateSuccess, disabled }) => {
  const handleClick = () => {
    // dataProvider(UPDATE, "tm", {
    //   id: record.id,
    //   action: "confirm"
    // })
    //   .then(() => {
    //     dispatch(showNotification("Order confirmed"));
    //   })
    //   .catch(e => {
    //     dispatch(showNotification("Error: Order Error", "warning"));
    //   });
    dataProvider(UPDATE, 'tm', { id: record.id, action: "confirm" }, {
      onSuccess: {
        notification: { body: 'notification.confirmed', level: 'info' },
        // refresh: true,
        callback: onUpdateSuccess
      },
      onFailure: {
        notification: { body: 'notification.error', level: 'warning' }
      }
    })
  };
  const dialogRef = useRef<SimpleConfirmModal>(null);

  return (
    <>
      <Button
        label="actions.confirm"
        disabled={disabled}
        onClick={() =>
          dialogRef &&
          dialogRef.current &&
          dialogRef.current
            .showModal(null)
            .pipe(
              catchError(err => {
                console.error(err);
                return NEVER;
              })
            )
            .subscribe(handleClick)
        }
      >
        <Check />
      </Button>
      <SimpleConfirmModal
        ref={dialogRef}
        onClose={(isOk, data) => void 0}
        tip="确认该交易理由？"
      />
    </>
  );
};

ConfirmButton.propTypes = {
  dataProvider: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  push: PropTypes.func,
  record: PropTypes.object,
  onUpdateSuccess: PropTypes.func,
  disabled: PropTypes.bool
};

const ConfirmButtonWrapper = withDataProvider(ConfirmButton);
export { ConfirmButtonWrapper as ConfirmButton };
export default ConfirmButtonWrapper;

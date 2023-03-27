import Close from "@material-ui/icons/Close";
import * as PropTypes from "prop-types";
import React from "react";
import {
  Button,
  showNotification,
  UPDATE,
  withDataProvider
} from "react-admin";
import { push } from "react-router-redux";
import { catchError } from "rxjs/operators";
import { NEVER } from "rxjs";
import { SimpleConfirmModal } from "../common/SimpleConfirm";
const { useRef } = React;

const CancelButton = ({ dataProvider, dispatch, record, history }) => {
  const dialogRef = useRef<SimpleConfirmModal>(null);
  const handleClick = () => {
    // dataProvider(UPDATE, "order", {
    //   id: record.id,
    //   action: "cancel"
    // })
    //   .then(response => {
    //     dispatch(showNotification("Order canceled"));
    //     history.goBack();
    //   })
    //   .catch(e => {
    //     dispatch(showNotification("Error: Order Error", "warning"));
    //   });
    dataProvider(UPDATE, 'order', { id: record.id, action: "cancel" }, {
      onSuccess: {
        notification: { body: 'notification.canceled', level: 'info' },
          redirectTo: '/order',
      },
      onFailure: {
        notification: { body: 'notification.error', level: 'warning' }
      }
    })
  };

  return (
    <>
      <Button
        label="actions.cancel"
        color="secondary"
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
        <Close />
      </Button>
      <SimpleConfirmModal
        ref={dialogRef}
        onClose={(isOk, data) => void 0}
        tip="取消该订单?"
      />
    </>
  );
};

CancelButton.propTypes = {
  dataProvider: PropTypes.func.isRequired,
  record: PropTypes.object,
};

const CancelButtonWrapper = withDataProvider(CancelButton);
export { CancelButtonWrapper as CancelButton };
export default CancelButtonWrapper;

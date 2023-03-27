import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider
} from "@material-ui/core";
import React, { Component } from "react";
import { Subject } from "rxjs";
type Props = {
  onClose: (isOk: boolean, data: any) => any;
  tip?: string;
  title?: string;
};
type State = {
  isOpen: boolean;
  data: any;
};
export class SimpleConfirmModal extends Component<Props, State> {
  state = {
    isOpen: false,
    data: null
  };
  future: Subject<any> | undefined;
  showModal = data => {
    this.setState({ isOpen: true, data });
    this.future = new Subject<typeof data>();
    return this.future;
  };
  close = (isOk: boolean) => {
    this.setState({ isOpen: false });
    this.props.onClose(isOk, this.state.data);
    if (this.future) {
      if (isOk) {
        this.future.next(this.state.data);
      } else {
        this.future.error(this.state.data);
      }
    }
  };
  render() {
    const { isOpen, data } = this.state;
    const { title, tip, onClose } = this.props;
    return (
      <Dialog aria-labelledby="simple-dialog-title" open={isOpen}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {tip && (
            <DialogContentText style={{ textAlign: "center" }}>
              {tip}
            </DialogContentText>
          )}
          {this.props.children && <p />}
          {this.props.children && <Divider></Divider>}
          {this.props.children}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.close(true)} autoFocus>
            Ok
          </Button>
          <Button onClick={() => this.close(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

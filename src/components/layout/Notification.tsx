import React from "react";

import { Notification } from "react-admin";

export const ISANotification = props =>
  React.createElement(Notification, {
    ...props,
    anchorOrigin: { vertical: "top", horizontal: "right" }
  });

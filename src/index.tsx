import React from "react";
import ReactDOM from "react-dom";
// import LogRocket from "logrocket";
// import * as Sentry from "@sentry/browser";
import App from "./App";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

// LogRocket.init("byzjot/barn-web");
// Sentry.init({
//   dsn:
//     "https://e04f6e212f0c4160ba715cc7d78f9888@o309688.ingest.sentry.io/5223816"
// });
//
// LogRocket.getSessionURL(sessionURL => {
//   Sentry.configureScope(scope => {
//     scope.setExtra("sessionURL", sessionURL);
//   });
// });

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

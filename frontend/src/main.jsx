import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import App from "./App";
import "./styles/global.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { checkAuthStatus } from "./features/auth/authSlice";

// Dispatch the action to check for an existing session (via httpOnly cookie)
// This is crucial for re-hydrating the user state after social logins.
store.dispatch(checkAuthStatus());

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <App />
          </Router>
        </PersistGate>
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>
);

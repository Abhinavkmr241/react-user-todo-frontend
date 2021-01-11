import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import "../node_modules/@coreui/coreui/dist/css/coreui.min.css";
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from "react-toasts";
import './App.scss';
import SignUp from './pages/signup-page';
import LoginPage from './pages/login-page';
import ForgotPasswordPage from './pages/forgot-password-page';
import PublicRoute from './components/public-route';
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import DefaultLayout from "./containers/DefaultLayout/DefaultLayout";

function App() {

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router>
          <div>
            <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.BOTTOM_RIGHT} />
            <Switch>
              <PublicRoute exact path="/signup" component={SignUp} redirectRoute={"/todos"} />
              <PublicRoute exact path="/login" component={LoginPage} redirectRoute={"/todos"} />
              <PublicRoute exact path="/forgot-password" component={ForgotPasswordPage} redirectRoute={"/todos"} />
              <Route exact path="/index" render={() => <Redirect to="/login" />} />

              <Route path="/" component={DefaultLayout} />
              <Route path="*" render={() => <Redirect to="/" />} />
            </Switch>
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;

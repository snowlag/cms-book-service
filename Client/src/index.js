/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";

// core components
import Admin from "layouts/Admin.js";
import Landing from "layouts/landing.js"
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser } from './actions/authAction';
import "assets/css/material-dashboard-react.css?v=1.8.0";
import store from "./store.js"
const hist = createBrowserHistory();


if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
}

ReactDOM.render(
 <Provider store={store}>
  <Router history={hist}>
    <Switch>
      <Route path="/admin" component={Admin} />
      <Route path="/" component={Landing} />
    </Switch>
  </Router>
  </Provider>,
  document.getElementById("root")
);

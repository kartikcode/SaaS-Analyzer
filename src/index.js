/*!

=========================================================
* Black Dashboard PRO React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import AuthLayout from "layouts/Auth/Auth.js";
import AdminLayout from "layouts/Admin/Admin.js";
import HomeLayout from "layouts/Home/Home.js";
import RTLLayout from "layouts/RTL/RTL.js";
import TabLayout from "layouts/Tab/Tab.js";
import CompareLayout from "layouts/Compare/Compare.js";

import "assets/css/nucleo-icons.css";
import "react-notification-alert/dist/animate.css";
import "assets/scss/black-dashboard-pro-react.scss?v=1.2.0";
import "assets/demo/demo.css";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/auth" render={(props) => <AuthLayout {...props} />} />
      <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
      <Route path="/rtl" render={(props) => <RTLLayout {...props} />} />
      <Route path="/tab" render={(props) => <TabLayout {...props} />} />
      <Route path="/compare" render={(props) => <CompareLayout {...props} />} />
      <Route path="/" render={(props) => <HomeLayout {...props} />} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);

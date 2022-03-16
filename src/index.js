import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import HomeLayout from "layouts/Home/Home.js";
import TabLayout from "layouts/Tab/Tab.js";
import CompareLayout from "layouts/Compare/Compare.js";

import "assets/css/nucleo-icons.css";
import "react-notification-alert/dist/animate.css";
import "assets/scss/black-dashboard-pro-react.scss?v=1.2.0";
import ExtractLayout from "layouts/Extract/Extract";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/tab" render={(props) => <TabLayout {...props} />} />
      <Route path="/compare" render={(props) => <CompareLayout {...props} />} />
      <Route path="/extract" render={(props) => <ExtractLayout {...props} />} />
      <Route path="/" render={(props) => <HomeLayout {...props} />} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);

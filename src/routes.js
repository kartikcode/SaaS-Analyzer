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
import VectorMap from "views/maps/VectorMap.js";
import GoogleMaps from "views/maps/GoogleMaps.js";
import FullScreenMap from "views/maps/FullScreenMap.js";
import ReactTables from "views/tables/ReactTables.js";
import RegularTables from "views/tables/RegularTables.js";
import ExtendedTables from "views/tables/ExtendedTables.js";
import Wizard from "views/forms/Wizard.js";
import ValidationForms from "views/forms/ValidationForms.js";
import ExtendedForms from "views/forms/ExtendedForms.js";
import RegularForms from "views/forms/RegularForms.js";
import Calendar from "views/Calendar.js";
import Widgets from "views/Widgets.js";
import Charts from "views/Charts.js";
import Dashboard from "views/Dashboard.js";
import Buttons from "views/components/Buttons.js";
import SweetAlert from "views/components/SweetAlert.js";
import Notifications from "views/components/Notifications.js";
import Grid from "views/components/Grid.js";
import Typography from "views/components/Typography.js";
import Panels from "views/components/Panels.js";
import Icons from "views/components/Icons.js";
import Pricing from "views/pages/Pricing.js";
import Register from "views/pages/Register.js";
import Timeline from "views/pages/Timeline.js";
import User from "views/pages/User.js";
import Login from "views/pages/Login.js";
import Rtl from "views/pages/Rtl.js";
import Lock from "views/pages/Lock.js";

const routes = [
  {
    path: "/search",
    name: "Search",
    key: +new Date(),
    icon: "tim-icons icon-zoom-split",
    component: Dashboard,
    layout: "/saas",
  },
  {
    path: "/compare",
    name: "Compare",
    icon: "tim-icons icon-chart-bar-32",
    component: Widgets,
    layout: "/saas",
  },
  {
    path: "/extract",
    name: "Export Data",
    icon: "tim-icons icon-cloud-download-93",
    component: Charts,
    layout: "/saas",
  },
  {
    // path: "/usermannual",
    // name: "User Mannual",
    // icon: "tim-icons icon-book-bookmark",
    // icon: "tim-icons icon-book-bookmark",
    // // component: "",
    // layout: "/saas",
  },
];

export default routes;

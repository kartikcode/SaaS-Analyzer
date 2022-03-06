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

import { Button, CustomInput } from "reactstrap";

const FixedPlugin = (props) => {
  const [classes, setClasses] = React.useState("dropdown");
  const [darkMode, setDarkMode] = React.useState(false);
  const handleClick = () => {
    if (classes === "dropdown") {
      setClasses("dropdown show");
    } else {
      setClasses("dropdown");
    }
  };
  const handleActiveMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("white-content");
  };
  return (
    <div className="fixed-plugin">
      <div className={classes}>
        <a
          href="#pablo"
          onClick={(e) => {
            e.preventDefault();
            handleClick();
          }}
        >
          <i className="fa fa-cog fa-2x" />
        </a>
        <ul className="dropdown-menu show">
          <li className="header-title">SIDEBAR BACKGROUND</li>
          <li className="adjustments-line">
            <div className="badge-colors text-center">
              <span
                className={
                  props.activeColor === "primary"
                    ? "badge filter badge-primary active"
                    : "badge filter badge-primary"
                }
                data-color="primary"
                onClick={() => {
                  props.handleActiveClick("primary");
                }}
              />
              <span
                className={
                  props.activeColor === "blue"
                    ? "badge filter badge-info active"
                    : "badge filter badge-info"
                }
                data-color="info"
                onClick={() => {
                  props.handleActiveClick("blue");
                }}
              />
              <span
                className={
                  props.activeColor === "green"
                    ? "badge filter badge-success active"
                    : "badge filter badge-success"
                }
                data-color="success"
                onClick={() => {
                  props.handleActiveClick("green");
                }}
              />
              <span
                className={
                  props.activeColor === "orange"
                    ? "badge filter badge-warning active"
                    : "badge filter badge-warning"
                }
                data-color="warning"
                onClick={() => {
                  props.handleActiveClick("orange");
                }}
              />
              <span
                className={
                  props.activeColor === "red"
                    ? "badge filter badge-danger active"
                    : "badge filter badge-danger"
                }
                data-color="danger"
                onClick={() => {
                  props.handleActiveClick("red");
                }}
              />
            </div>
          </li>
          <li className="header-title">SIDEBAR MINI</li>
          <li className="adjustments-line">
            <div className="togglebutton switch-sidebar-mini d-flex align-items-center justify-content-center">
              <span className="label-switch">OFF</span>
              <CustomInput
                type="switch"
                id="switch-1"
                onChange={props.handleMiniClick}
                value={props.sidebarMini}
                className="mt-n4"
              />
              <span className="label-switch ml-n3">ON</span>
            </div>
          </li>
          <li className="adjustments-line">
            <div className="togglebutton switch-change-color mt-3 d-flex align-items-center justify-content-center">
              <span className="label-switch">LIGHT MODE</span>
              <CustomInput
                type="switch"
                id="switch-2"
                onChange={handleActiveMode}
                value={darkMode}
                className="mt-n4"
              />
              <span className="label-switch ml-n3">DARK MODE</span>
            </div>
          </li>
          <li className="button-container">
            <Button
              href="https://www.creative-tim.com/product/black-dashboard-pro-react"
              color="primary"
              block
              className="btn-round"
            >
              Buy now
            </Button>
          </li>
          <li className="button-container">
            <Button
              color="default"
              block
              className="btn-round"
              outline
              href="https://demos.creative-tim.com/black-dashboard-pro-react/#/documentation/tutorial"
              target="_blank"
            >
              <i className="nc-icon nc-paper" /> Documentation
            </Button>
          </li>
          <li className="button-container">
            <Button
              href="https://www.creative-tim.com/product/black-dashboard-react"
              color="info"
              block
              className="btn-round"
            >
              Get free version
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FixedPlugin;

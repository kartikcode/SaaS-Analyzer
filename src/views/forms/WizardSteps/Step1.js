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
import classnames from "classnames";
// reactstrap components
import {
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";

const Step1 = React.forwardRef((props, ref) => {
  // eslint-disable-next-line
  const [firstname, setfirstname] = React.useState("");
  const [firstnameState, setfirstnameState] = React.useState("");
  const [firstnameFocus, setfirstnameFocus] = React.useState("");
  // eslint-disable-next-line
  const [lastname, setlastname] = React.useState("");
  const [lastnameState, setlastnameState] = React.useState("");
  const [lastnameFocus, setlastnameFocus] = React.useState("");
  // eslint-disable-next-line
  const [email, setemail] = React.useState("");
  const [emailState, setemailState] = React.useState("");
  const [emailFocus, setemailFocus] = React.useState("");
  // eslint-disable-next-line
  const [phone, setphone] = React.useState("");
  const [phoneFocus, setphoneFocus] = React.useState("");
  const [phoneState, setphoneState] = React.useState("");
  const [addressFocus, setaddressFocus] = React.useState("");
  const stateFunctions = {
    setphoneState: (value) => setphoneState(value),
    setphone: (value) => setphone(value),
    setemailState: (value) => setemailState(value),
    setemail: (value) => setemail(value),
    setlastnameState: (value) => setlastnameState(value),
    setlastname: (value) => setlastname(value),
    setfirstnameState: (value) => setfirstnameState(value),
    setfirstname: (value) => setfirstname(value),
  };
  // function that returns true if value is email, false otherwise
  const verifyEmail = (value) => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  };
  // function that verifies if a string has a given length or not
  const verifyLength = (value, length) => {
    if (value.length >= length) {
      return true;
    }
    return false;
  };
  // function that verifies if value contains only numbers
  const verifyNumber = (value) => {
    var numberRex = new RegExp("^[0-9]+$");
    if (numberRex.test(value)) {
      return true;
    }
    return false;
  };
  const change = (event, stateName, type, stateNameEqualTo, maxValue) => {
    switch (type) {
      case "email":
        if (verifyEmail(event.target.value)) {
          stateFunctions["set" + stateName + "State"]("has-success");
        } else {
          stateFunctions["set" + stateName + "State"]("has-danger");
        }
        break;
      case "length":
        if (verifyLength(event.target.value, stateNameEqualTo)) {
          stateFunctions["set" + stateName + "State"]("has-success");
        } else {
          stateFunctions["set" + stateName + "State"]("has-danger");
        }
        break;
      case "number":
        if (verifyNumber(event.target.value, stateNameEqualTo)) {
          stateFunctions["set" + stateName + "State"]("has-success");
        } else {
          stateFunctions["set" + stateName + "State"]("has-danger");
        }
        break;
      default:
        break;
    }
    stateFunctions["set" + stateName](event.target.value);
  };
  /*eslint-disable-next-line*/
  const isValidated = () => {
    if (
      firstnameState === "has-success" &&
      lastnameState === "has-success" &&
      emailState === "has-success" &&
      phoneState === "has-success"
    ) {
      return true;
    } else {
      if (firstnameState !== "has-success") {
        setfirstnameState("has-danger");
      }
      if (lastnameState !== "has-success") {
        setlastnameState("has-danger");
      }
      if (emailState !== "has-success") {
        setemailState("has-danger");
      }
      if (phoneState !== "has-success") {
        setphoneState("has-danger");
      }
      return false;
    }
  };
  React.useImperativeHandle(ref, () => ({
    isValidated: () => {
      return isValidated();
    },
  }));
  return (
    <>
      <h5 className="info-text">
        Let's start with the basic information (with validation)
      </h5>
      <Row className="justify-content-center mt-5">
        <Col sm="5">
          <InputGroup
            className={classnames(firstnameState, {
              "input-group-focus": firstnameFocus,
            })}
          >
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i className="tim-icons icon-single-02" />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              name="firstname"
              placeholder="First Name..."
              type="text"
              onChange={(e) => change(e, "firstname", "length", 1)}
              onFocus={(e) => setfirstnameFocus(true)}
              onBlur={(e) => setfirstnameFocus(false)}
            />
            {firstnameState === "has-danger" ? (
              <label className="error">This field is required.</label>
            ) : null}
          </InputGroup>
          <InputGroup
            className={classnames(emailState, {
              "input-group-focus": emailFocus,
            })}
          >
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i className="tim-icons icon-email-85" />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              name="email"
              placeholder="Email..."
              type="email"
              onChange={(e) => change(e, "email", "email")}
              onFocus={(e) => setemailFocus(true)}
              onBlur={(e) => setemailFocus(false)}
            />
            {emailState === "has-danger" ? (
              <label className="error">This field is required.</label>
            ) : null}
          </InputGroup>
        </Col>
        <Col sm="5">
          <InputGroup
            className={classnames(lastnameState, {
              "input-group-focus": lastnameFocus,
            })}
          >
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i className="tim-icons icon-caps-small" />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              name="lastname"
              placeholder="Last Name..."
              type="text"
              onChange={(e) => change(e, "lastname", "length", 1)}
              onFocus={(e) => setlastnameFocus(true)}
              onBlur={(e) => setlastnameFocus(false)}
            />
            {lastnameState === "has-danger" ? (
              <label className="error">This field is required.</label>
            ) : null}
          </InputGroup>
          <InputGroup
            className={classnames(phoneState, {
              "input-group-focus": phoneFocus,
            })}
          >
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i className="tim-icons icon-mobile" />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              name="number"
              placeholder="Phone..."
              type="number"
              onChange={(e) => change(e, "phone", "number")}
              onFocus={(e) => setphoneFocus(true)}
              onBlur={(e) => setphoneFocus(false)}
            />
            {phoneState === "has-danger" ? (
              <label className="error">This field is required.</label>
            ) : null}
          </InputGroup>
        </Col>
        <Col sm="10">
          <InputGroup
            className={classnames({
              "input-group-focus": addressFocus,
            })}
          >
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i className="tim-icons icon-square-pin" />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              name="address"
              placeholder="Address"
              type="text"
              onFocus={(e) => setaddressFocus(true)}
              onBlur={(e) => setaddressFocus(false)}
            />
          </InputGroup>
        </Col>
      </Row>
    </>
  );
});

export default Step1;

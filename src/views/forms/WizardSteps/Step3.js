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
// react plugin used to create DropdownMenu for selecting items
import Select from "react-select";

// reactstrap components
import { FormGroup, Input, Row, Col } from "reactstrap";

const Step3 = React.forwardRef((props, ref) => {
  const [step3Select, setstep3Select] = React.useState(null);
  React.useImperativeHandle(ref, () => ({
    isValidated: undefined,
  }));
  return (
    <>
      <form>
        <Row className="justify-content-center">
          <Col sm="12">
            <h5 className="info-text">Are you living in a nice area?</h5>
          </Col>
          <Col sm="7">
            <FormGroup>
              <label>Street Name</label>
              <Input type="text" />
            </FormGroup>
          </Col>
          <Col sm="3">
            <FormGroup>
              <label>Street No.</label>
              <Input type="text" />
            </FormGroup>
          </Col>
          <Col sm="5">
            <FormGroup>
              <label>City</label>
              <Input type="text" />
            </FormGroup>
          </Col>
          <Col sm="5">
            <FormGroup>
              <label>Country</label>
              <Select
                className="react-select info"
                classNamePrefix="react-select"
                name=""
                onChange={(value) => setstep3Select(value)}
                value={step3Select}
                options={[
                  {
                    value: "Afghanistan",
                    label: " Afghanistan ",
                  },
                  { value: "Albania", label: " Albania " },
                  { value: "Algeria", label: " Algeria " },
                  {
                    value: "American Samoa",
                    label: " American Samoa ",
                  },
                  { value: "Andorra", label: " Andorra " },
                  { value: "Angola", label: " Angola " },
                  { value: "Anguilla", label: " Anguilla " },
                  { value: "Antarctica", label: " Antarctica " },
                ]}
                placeholder="Single Select"
              />
            </FormGroup>
          </Col>
        </Row>
      </form>
    </>
  );
});

export default Step3;

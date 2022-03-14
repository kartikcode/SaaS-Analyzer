import React from "react";

import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";

import Select from "react-select";

import { chartExample6 } from "variables/charts.js";

import ChartCard from "components/Charts/ChartCard";
import NumberCard from "components/NumberCards/NumberCards";
import Footer from "components/Footer/Footer";

const CompareLayout = () => {
  const multipleSelectValues1 = [
    { value: "0", label: "No of Qualified Leads" },
    {
      value: "1",
      label: "No of new Accounts per month",
    },
    {
      value: "2",
      label: "Total number of users",
    },
    {
      value: "3",
      label: "Life time Value of a User",
    },
    {
      value: "4",
      label: "Length of Sales Cycle",
    },
  ];
  const [multipleSelect1, setmultipleSelect1] = React.useState(
    multipleSelectValues1
  );
  // const [multipleSelect2, setmultipleSelect2] = React.useState(null);
  // const [multipleSelect3, setmultipleSelect3] = React.useState(null);
  // const [multipleSelect4, setmultipleSelect4] = React.useState(null);

  return (
    <>
      <div className="container full-width">
        <Row>
          <Col className="ml-auto mr-auto" md="12">
            <Card className="card-plain card-subcategories">
              <CardHeader>
                <CardTitle className="text-center mt-5" tag="h1">
                  <h4 className="h1 text-white bold text-center">
                    Company Comparision: A vs B
                  </h4>
                </CardTitle>
                <br />
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md="4">
                    <h4 className="h4 text-white">Select what to display:</h4>
                  </Col>
                  <Col lg="8" md="8" sm="3">
                    <Select
                      className="react-select info"
                      classNamePrefix="react-select"
                      placeholder="Choose metrics"
                      name="multipleSelect"
                      closeMenuOnSelect={false}
                      isMulti
                      value={multipleSelect1}
                      onChange={(value) => {
                        if (value == null) setmultipleSelect1([]);
                        else setmultipleSelect1(value);
                      }}
                      options={multipleSelectValues1}
                    />
                  </Col>
                </Row>
                <br />

                <Row>
                  <Col>
                    <h4 className="h4 text-center">Company A</h4>
                  </Col>
                  <Col>
                    <h4 className="h4 text-center">Company B</h4>
                  </Col>
                </Row>
                {multipleSelect1.some(
                  (selection) =>
                    selection.value === multipleSelectValues1[4].value
                ) && (
                  <Row>
                    <Col>
                      <NumberCard
                        label={multipleSelectValues1[4].label}
                        mainValue="12 months"
                        byLine="This is some other text"
                        isVisible
                      />
                    </Col>
                    <Col>
                      <NumberCard
                        label={multipleSelectValues1[4].label}
                        mainValue="15 months"
                        byLine="This is some text"
                        isVisible
                      />
                    </Col>
                  </Row>
                )}

                {multipleSelect1.some(
                  (selection) =>
                    selection.value === multipleSelectValues1[0].value
                ) && (
                  <Row>
                    <Col>
                      <ChartCard
                        type="line"
                        label={multipleSelectValues1[0].label}
                        mainValue="7500"
                        chartObject={chartExample6}
                        isVisible
                      />
                    </Col>
                    <Col>
                      <ChartCard
                        type="line"
                        label={multipleSelectValues1[0].label}
                        mainValue="7500"
                        chartObject={chartExample6}
                        isVisible
                      />
                    </Col>
                  </Row>
                )}

                {multipleSelect1.some(
                  (selection) =>
                    selection.value === multipleSelectValues1[1].value
                ) && (
                  <Row>
                    <Col>
                      <ChartCard
                        type="line"
                        label={multipleSelectValues1[1].label}
                        mainValue="75000"
                        chartObject={chartExample6}
                        isVisible
                      />
                    </Col>
                    <Col>
                      <ChartCard
                        type="line"
                        label={multipleSelectValues1[1].label}
                        mainValue="75000"
                        chartObject={chartExample6}
                        isVisible
                      />
                    </Col>
                  </Row>
                )}

                {multipleSelect1.some(
                  (selection) =>
                    selection.value === multipleSelectValues1[2].value
                ) && (
                  <Row>
                    <Col>
                      <NumberCard
                        label={multipleSelectValues1[2].label}
                        mainValue="75000"
                        byLine="Last Research"
                        isVisible
                      />
                    </Col>
                    <Col>
                      <NumberCard
                        label={multipleSelectValues1[2].label}
                        mainValue="15263"
                        byLine="Last Research"
                        isVisible
                      />
                    </Col>
                  </Row>
                )}

                {multipleSelect1.some(
                  (selection) =>
                    selection.value === multipleSelectValues1[3].value
                ) && (
                  <Row>
                    <Col>
                      <NumberCard
                        label={multipleSelectValues1[3].label}
                        mainValue="75000"
                        byLine=""
                        isVisible
                      />
                    </Col>
                    <Col>
                      <NumberCard
                        label={multipleSelectValues1[3].label}
                        mainValue="15263"
                        byLine=""
                        isVisible
                      />
                    </Col>
                  </Row>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
      <Footer fluid />
    </>
  );
};

export default CompareLayout;

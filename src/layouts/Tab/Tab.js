import React, { useState } from "react";

import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Row,
  Col,
} from "reactstrap";

import Select from "react-select";

import { chartExample6, chartExample7 } from "variables/charts.js";

import ChartCard from "components/Charts/ChartCard";
import Footer from "components/Footer/Footer";

const TabLayout = () => {
  const [pageTabs, setpageTabs] = useState("1");
  const multipleSelectValues1 = [
    { value: "0", label: "No of Qualified Leads" },
    {
      value: "1",
      label: "No of new Accounts per month",
    },
    {
      value: "2",
      label: "Percent conversion rate of each stage",
    },
    { value: "3", label: "Length of sales cycle" },
    { value: "4", label: "Customer Acquisition Cost" },
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
                    Company name
                  </h4>
                </CardTitle>
                <br />
              </CardHeader>
              <CardBody>
                {/* color-classes: "nav-pills-primary", "nav-pills-info", "nav-pills-success", "nav-pills-warning","nav-pills-danger" */}
                <Nav
                  className="nav-pills-info nav-pills-icons justify-content-center"
                  pills
                >
                  <NavItem>
                    <NavLink
                      data-toggle="tab"
                      href="#acquisition"
                      className={pageTabs === "1" ? "active" : ""}
                      onClick={() => setpageTabs("1")}
                    >
                      <i className="tim-icons icon-istanbul" />
                      Acquisition
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      data-toggle="tab"
                      href="#engagement"
                      className={pageTabs === "2" ? "active" : ""}
                      onClick={() => setpageTabs("2")}
                    >
                      <i className="tim-icons icon-bag-16" />
                      Engagement &amp; Retention
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      data-toggle="tab"
                      href="#revenue"
                      className={pageTabs === "3" ? "active" : ""}
                      onClick={() => setpageTabs("3")}
                    >
                      <i className="tim-icons icon-coins" />
                      Revenue &amp; Growth
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      data-toggle="tab"
                      href="#economics"
                      className={pageTabs === "4" ? "active" : ""}
                      onClick={() => setpageTabs("4")}
                    >
                      <i className="tim-icons icon-settings" />
                      Unit Economics
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent
                  className="tab-space tab-subcategories"
                  activeTab={pageTabs}
                >
                  <TabPane tabId="1">
                    <h4 className="h4 text-center">
                      How efficient and predictible is your sales funnel?
                    </h4>
                    <br />
                    <Row>
                      <Col md="4">
                        <h4 className="h4 text-white">
                          Select what to display:
                        </h4>
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
                        <ChartCard
                          type="line"
                          label={multipleSelectValues1[0].label}
                          mainValue="7500"
                          chartObject={chartExample6}
                          isVisible={multipleSelect1.some(
                            (selection) =>
                              selection.value === multipleSelectValues1[0].value
                          )}
                        />
                      </Col>
                      <Col>
                        <ChartCard
                          type="line"
                          label={multipleSelectValues1[1].label}
                          mainValue="750000"
                          chartObject={chartExample6}
                          isVisible={multipleSelect1.some(
                            (selection) =>
                              selection.value === multipleSelectValues1[1].value
                          )}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <ChartCard
                          type="bar"
                          label={multipleSelectValues1[2].label}
                          mainValue="7500"
                          isVisible={multipleSelect1.some(
                            (selection) =>
                              selection.value === multipleSelectValues1[2].value
                          )}
                          chartObject={chartExample7}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <ChartCard
                          type="bar"
                          label={multipleSelectValues1[3].label}
                          mainValue="7500"
                          chartObject={chartExample7}
                          isVisible={multipleSelect1.some(
                            (selection) =>
                              selection.value === multipleSelectValues1[3].value
                          )}
                        />
                      </Col>
                      <Col>
                        <ChartCard
                          type="line"
                          label={multipleSelectValues1[4].label}
                          mainValue="96545"
                          chartObject={chartExample6}
                          isVisible={multipleSelect1.some(
                            (selection) =>
                              selection.value === multipleSelectValues1[4].value
                          )}
                        />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                    <h4 className="h4 text-center">
                      How much do your customer love your platform?
                    </h4>{" "}
                    <br />
                    <Row>
                      <Col>
                        <ChartCard
                          type="line"
                          label="No active users"
                          mainValue="5000"
                          chartObject={chartExample6}
                          isVisible
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <ChartCard
                          type="bar"
                          label="DAU/MAU Ratio"
                          mainValue="5.12"
                          chartObject={chartExample7}
                          isVisible
                        />
                      </Col>
                      <Col>
                        <ChartCard
                          type="line"
                          label="Percentage penetration"
                          mainValue="69"
                          chartObject={chartExample6}
                          isVisible
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <ChartCard
                          type="line"
                          label="Net Promoter Score"
                          mainValue="69"
                          chartObject={chartExample6}
                          isVisible
                        />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="3">
                    <h4 className="h4 text-center">
                      How much are your customers are willing to pay?
                    </h4>
                    <br />
                    TODO
                  </TabPane>
                  <TabPane tabId="4">
                    Completely synergize resource taxing relationships via
                    premier niche markets. Professionally cultivate one-to-one
                    customer service with robust ideas. <br />
                    <br />
                    Dynamically innovate resource-leveling customer service for
                    state of the art customer service.
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
      <Footer fluid />
    </>
  );
};

export default TabLayout;

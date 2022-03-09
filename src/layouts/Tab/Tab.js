import React, { useState } from "react";

import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Row,
  Col,
} from "reactstrap";

import Footer from "components/Footer/Footer";
import classnames from "classnames";

const TabLayout = () => {
  // State for current active Tab
  const [currentActiveTab, setCurrentActiveTab] = useState("1");

  // Toggle active state for Tab
  const toggle = (tab) => {
    if (currentActiveTab !== tab) setCurrentActiveTab(tab);
  };
  return (
    <>
      <div className="container full-page" style={{ paddingTop: 25 }}>
        <h4 className="h1 text-white bold text-center">
          POC for Tab based pages
        </h4>
        <Card className="text-center">
          <CardHeader>
            <Nav
              tabs
              className="justify-content-center"
              style={{ cursor: "pointer" }}
            >
              <NavItem>
                <NavLink
                  className={classnames({
                    active: currentActiveTab === "1",
                  })}
                  onClick={() => {
                    toggle("1");
                  }}
                >
                  Acquisition
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: currentActiveTab === "2",
                  })}
                  onClick={() => {
                    toggle("2");
                  }}
                >
                  Engagement &amp; Retention
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: currentActiveTab === "3",
                  })}
                  onClick={() => {
                    toggle("3");
                  }}
                >
                  Revenue &amp; Growth
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: currentActiveTab === "4",
                  })}
                  onClick={() => {
                    toggle("4");
                  }}
                >
                  Unit Economics
                </NavLink>
              </NavItem>
            </Nav>
          </CardHeader>
          <CardBody>
            <CardTitle>Something that won't change</CardTitle>
            <CardText>
              <TabContent activeTab={currentActiveTab}>
                <TabPane tabId="1">
                  <Row>
                    <Col sm="12">
                      <h5>Sample Tab 1 Content</h5>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <Col sm="12">
                      <h5>Sample Tab 2 Content</h5>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="3">
                  <Row>
                    <Col sm="12">
                      <h5>Sample Tab 3 Content</h5>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="4">
                  <Row>
                    <Col sm="12">
                      <h5>Sample Tab 4 Content</h5>
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </CardText>
          </CardBody>
        </Card>
      </div>
      <Footer fluid />
    </>
  );
};

export default TabLayout;

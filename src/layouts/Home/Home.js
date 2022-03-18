import React from "react";

// reactstrap components
import {
  Card,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
} from "reactstrap";

import SearchForm from "components/SearchForm/SearchForm";
import Footer from "components/Footer/Footer";
import CompareForm from "components/CompareForm/CompareForm";
import ExtractForm from "components/ExtractForm/ExtractForm";

const HomeLayout = () => {
  const [horizontalTabs, sethorizontalTabs] = React.useState("search");
  const changeActiveTab = (e, tabName) => {
    e.preventDefault();
    sethorizontalTabs(tabName);
  };
  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <div className="container" style={{ paddingTop: 25 }}>
          <blockquote className="blockquote text-center">
          <h1 className="mb-2">SEFASSC</h1>
            <h3 className="mb-0">
              SEC Filing Analyzer for SaaS Companies
            </h3>
            {/* <footer className="blockquote-footer">IIT Kanpur</footer> */}
          </blockquote>
          <div className="" style={{ paddingTop: 35 }}>
            <Card>
              <CardBody>
                <Nav className="nav-pills-info" pills justified fill>
                  <NavItem>
                    <NavLink
                      data-toggle="tab"
                      className={horizontalTabs === "search" ? "active" : ""}
                      onClick={(e) => changeActiveTab(e, "search")}
                    >
                      <span role="button">Search for a company</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      data-toggle="tab"
                      className={horizontalTabs === "compare" ? "active" : ""}
                      onClick={(e) => changeActiveTab(e, "compare")}
                    >
                      <span role="button">Compare two companies</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      data-toggle="tab"
                      className={horizontalTabs === "extract" ? "active" : ""}
                      onClick={(e) => changeActiveTab(e, "extract")}
                    >
                      <span role="button">Form Data Extraction</span>
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent className="tab-space" activeTab={horizontalTabs}>
                  <TabPane tabId="search">
                    <SearchForm />
                  </TabPane>
                  <TabPane tabId="compare">
                    <CompareForm />
                  </TabPane>
                  <TabPane tabId="extract">
                    <ExtractForm />
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </div>
        </div>
        <Footer fluid />
      </div>
    </>
  );
};

export default HomeLayout;

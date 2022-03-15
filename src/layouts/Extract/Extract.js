import React, { useState } from "react";

import {
  Card,
  CardHeader,
  CardBody,
  Collapse,
  CardTitle,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Row,
  Col,
} from "reactstrap";

import Footer from "components/Footer/Footer";

const ExtractLayout = () => {
  const [pageTabs, setpageTabs] = useState("1");
  const [isOpen, setIsOpen] = useState(1);
  const [lists, setLists] = useState([
    {
      _id: 1,
      question: "What is the name of the company?",
      answer: "Something",
    },
    {
      _id: 2,
      question: "What is the name of the project?",
      answer: "Something else",
    },
    {
      _id: 2,
      question: "Some other cool question?",
      answer: "Something else",
    },
  ]);
  const handleToggle = (id) => {
    if (isOpen === id) {
      setIsOpen(null);
    } else {
      setIsOpen(id);
    }
  };
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
                <Nav
                  className="nav-pills-info nav-pills-icons justify-content-center"
                  pills
                >
                  <NavItem>
                    <NavLink
                      data-toggle="tab"
                      className={pageTabs === "1" ? "active" : ""}
                      onClick={() => setpageTabs("1")}
                    >
                      <i className="tim-icons icon-pencil" />
                      FAQ's
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      data-toggle="tab"
                      className={pageTabs === "2" ? "active" : ""}
                      onClick={() => setpageTabs("2")}
                    >
                      <i className="tim-icons icon-single-copy-04" />
                      Summary
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent
                  className="tab-space tab-subcategories"
                  activeTab={pageTabs}
                >
                  <TabPane tabId="1">
                    {/* <CardHeader>
                      <CardTitle tag="h3">FAQs</CardTitle>
                    </CardHeader> */}

                    <div
                      aria-multiselectable={true}
                      className="card-collapse"
                      id="accordion"
                      role="tablist"
                    >
                      {lists.map((list) => (
                        <Card key={list._id}>
                          <CardHeader onClick={() => handleToggle(list._id)}>
                            <h4>{list.question}</h4>
                          </CardHeader>
                          <Collapse isOpen={isOpen === list._id}>
                            <CardBody>
                              <p>{list.answer}</p>
                            </CardBody>
                          </Collapse>
                        </Card>
                      ))}
                    </div>
                  </TabPane>
                  <TabPane tabId="2">
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

export default ExtractLayout;

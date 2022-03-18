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
import PrintBtn from "components/PrintBtn/PrintBtn";
import { getCompanyByName } from "api/callbacks";
import { getQnaByTicker } from "api/callbacks";

const ExtractLayout = () => {
  const [pageTabs, setpageTabs] = useState("1");
  const [isOpen, setIsOpen] = useState(1);
  const [lists, setLists] = useState([]);
  const [summary, setSummary] = useState("");
  const handleToggle = (id) => {
    if (isOpen === id) {
      setIsOpen(null);
    } else {
      setIsOpen(id);
    }
  };

  const companyName = localStorage.getItem("ExtractionSearchCompany");
  React.useEffect(() => {
    async function setValues() {
      const companyResult = await getCompanyByName(companyName);
      const qnadata = await getQnaByTicker(companyResult.ticker);
      setLists(qnadata.qna);
      setSummary(qnadata.summary);
    }
      
    setValues();
  }, [companyName]);
  const refToConvertSummary = React.createRef();
  return (
    <>
      <div className="container full-width">
        <Row>
          <Col className="ml-auto mr-auto" md="12">
            <Card className="card-plain card-subcategories">
              <CardHeader>
                <CardTitle className="text-center mt-5" tag="h1">
                  <h4 className="h1 text-white bold text-center">
                    {companyName}
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
                    <div
                      aria-multiselectable={true}
                      className="card-collapse"
                      id="accordion"
                      role="tablist"
                    >
                      {lists.map((list) => (
                        <Card key={lists.indexOf(list)}>
                          <CardHeader onClick={() => handleToggle(lists.indexOf(list))}>
                            <h4>{list.question}</h4>
                          </CardHeader>
                          <Collapse isOpen={isOpen === lists.indexOf(list)}>
                            <CardBody>
                              <p>{list.answer}</p>
                            </CardBody>
                          </Collapse>
                        </Card>
                      ))}
                    </div>
                  </TabPane>
                  <TabPane tabId="2">
                    <div ref={refToConvertSummary}>
                      <PrintBtn refToConvert={refToConvertSummary} />
                      {summary}
                    </div>
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

import React, { useState } from "react";

import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
} from "reactstrap";

import Select from "react-select";

import { chartExample6, chartExample7 } from "variables/charts.js";

import ChartCard from "components/Charts/ChartCard";
import Footer from "components/Footer/Footer";
import PrintBtn from "components/PrintBtn/PrintBtn";
import NumberCard from "components/NumberCards/NumberCards";
import { getCompanyByName } from "api/callbacks";
import { getOverviewByTicker } from "api/callbacks";

const TabLayout = () => {
  const companyName = localStorage.getItem("companyName");
  console.log("companyName", companyName);
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

  const numberCardValuesData = [
    { value: "0", label: "Annual Recurring Revenue (ARR)", byLine: "For the latest quarter" },
    {
      value: "1",
      label: "Net Revenue Retention Rate (NRR)",
      byLine: "For the latest quarter",
    },
    {
      value: "2",
      label: "Total customers",
      byLine: "For the latest quarter",
    },
  ];

  const [companyApiData, setCompanyApiData] = useState({});
  const [overviewApiData, setOverviewApiData] = useState({});
  // eslint-disable-next-line
  const [numberCardValues, setNumberCardValues] =
    React.useState(numberCardValuesData);
  const [ticker, setTicker] = useState("");
  const refToConvertFull = React.createRef();
  const refToConvertTab = React.createRef();

  React.useEffect(() => {
    async function setValues() {
      const companyResult = await getCompanyByName(companyName);
      setCompanyApiData(companyResult);
      setTicker(companyResult.ticker);
      const overviewResult = await getOverviewByTicker(ticker);
      setOverviewApiData(overviewResult);
    }
    setValues();
  }, [companyName, ticker]);

  return (
    <>
      <div ref={refToConvertFull}>
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
                <div className="row">
                        {/* <div className="flex bg-light mt-auto">{companyName}</div> */}
                        <PrintBtn refToConvert={refToConvertFull} />
                </div>
              </CardHeader>
              <CardBody>
                    <div ref={refToConvertTab}>
                      <h4 className="h5 text-light text-center">
                        {overviewApiData.description}
                      </h4>
                      <Row>
                        <Col>
                          <NumberCard
                            label={numberCardValues[0].label}
                            mainValue={(companyApiData.ARR)}
                            byLine={numberCardValues[0].byLine}
                            sentiment="good"
                            isVisible
                          />
                        </Col>
                        <Col>
                          <NumberCard
                            label={numberCardValues[1].label}
                            mainValue={companyApiData.NRR}
                            byLine={numberCardValues[1].byLine}
                            sentiment="bad"
                            isVisible
                          />
                        </Col>
                        <Col>
                          <NumberCard
                            label={numberCardValues[2].label}
                            mainValue={companyApiData.Customers}
                            byLine={numberCardValues[2].byLine}
                            isVisible
                          />
                        </Col>
                      </Row>

                    <div ref={refToConvertTab}>
                      {/* <h4 className="h4 text-center">
                        How efficient and predictible is your sales funnel?
                      </h4> */}
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
                      </Row>
                      <Row>
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
                      </Row>
                      <Row>
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
                      </Row>
                    </div>
                    </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
      </div>
      <Footer fluid />
    </>
  );
};

export default TabLayout;

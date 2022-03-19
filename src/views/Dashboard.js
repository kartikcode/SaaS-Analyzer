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
import React, { useEffect, useState } from "react";
import LoadingOverlay from "react-loading-overlay";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Label,
  FormGroup,
  Row,
  Col,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  Collapse,
} from "reactstrap";
import ChartCard from "components/Charts/ChartCard";
import NumberCard from "components/NumberCards/NumberCards";
import NotificationAlert from "react-notification-alert";
import PrintBtn from "components/PrintBtn/PrintBtn";
import Select from "react-select";
import ReactDatetime from "react-datetime";
import {
  searchOptions,
  overviewDataLabels,
  timeseriesChartLabels,
} from "variables/companies";
import {
  getCompanyByName,
  getOverviewByTicker,
  getTimeSeriesByTicker,
} from "api/callbacks.js";

const customStyles = {
  input: (provided) => ({
    ...provided,
    color: "#1d8cf8",
  }),
};

const chartData = (fillingdates, data, start, end) => {
  let max, min, label, datapoints;
  try {
    max = Math.max(...data);
    min = Math.min(...data);
    label = fillingdates.slice(start, end);
    datapoints = data.slice(start, end);
  } catch {
    max = 400;
    min = 0;
    label = [];
    datapoints = [];
  }
  return {
    data: (canvas) => {
      let ctx = canvas.getContext("2d");

      let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

      gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
      gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
      gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

      return {
        labels: label,
        datasets: [
          {
            label: "Data",
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: "#1f8ef1",
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: "#1f8ef1",
            pointBorderColor: "rgba(255,255,255,0)",
            pointHoverBackgroundColor: "#1f8ef1",
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: datapoints,
          },
        ],
      };
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      tooltips: {
        backgroundColor: "#f5f5f5",
        titleFontColor: "#333",
        bodyFontColor: "#666",
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.0)",
              zeroLineColor: "transparent",
            },
            ticks: {
              suggestedMin: min,
              suggestedMax: max,
              padding: 20,
              fontColor: "#9a9a9a",
            },
          },
        ],
        xAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.1)",
              zeroLineColor: "transparent",
            },
            ticks: {
              padding: 20,
              fontColor: "#9a9a9a",
            },
          },
        ],
      },
    },
  };
};

const Dashboard = () => {
  const [companyName, setCompanyName] = React.useState({
    value: "",
    label: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [naviTab, setNaviTab] = useState(1);
  const notificationAlertRef = React.useRef(null);
  const refToConvertFull = React.createRef();
  const refToConvertTab = React.createRef();
  const [companyApiData, setCompanyApiData] = useState({});
  const [overviewApiData, setOverviewApiData] = useState({});
  const [openedCollapseOne, setOpenedCollapseOne] = useState(false);
  const [ticker, setTicker] = useState("");
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(100);
  const [fromFillingDate, setFromFillingDate] = useState("");
  const [toFillingDate, setToFillingDate] = useState("");
  const [multipleSelect, setMultipleSelect] = useState(timeseriesChartLabels);
  const [timeSeriesApiData, setTimeSeriesApiData] = useState({
    quarTS: [],
    arrTS: [],
    custTS: [],
    empTS: [],
    nrrTS: [],
    smTS: [],
    srcTS: [],
  });

  const sendAlertNotification = async (message) => {
    let options = {
      place: "tr",
      message: message,
      type: "danger",
      icon: "tim-icons icon-alert-circle-exc",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };

  const setOverviewData = async () => {
    const overviewResult = await getOverviewByTicker(ticker);
    setOverviewApiData(overviewResult);
  };
  const setTimeSeriesData = async () => {
    const timeSeriesData = await getTimeSeriesByTicker(ticker);
    setTimeSeriesApiData(timeSeriesData);
  };

  useEffect(() => {
    if (ticker !== "") {
      setOverviewData();
      setTimeSeriesData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticker]);

  const handleOnClickSearch = async () => {
    async function setValues() {
      setOverviewData();
      setTimeSeriesData();
    }
    setIsLoading(true);
    if (companyName.value.length === 0) {
      sendAlertNotification("Please select a company");
      setIsLoading(false);
      return;
    }
    const companyResult = await getCompanyByName(companyName.label);
    setCompanyApiData(companyResult);
    setTicker(companyResult.ticker);
    await setValues();
    setIsLoading(false);
    setIsFetched(true);
  };

  const filterDatapoints = (from, to) => {
    const fillingdates = timeSeriesApiData.quarTS;
    let startbool = false;
    let endbool = false;
    fillingdates.forEach((date, i) => {
      if (startbool && !endbool && Date.parse(date) >= Date.parse(to)) {
        setEnd(i);
        endbool = true;
      } else if (!startbool && Date.parse(date) >= Date.parse(from)) {
        startbool = true;
        setStart(i);
      }
    });

    if (!startbool) alert("No Filling in this period");
    if (!endbool) setEnd(500);
  };

  const searchForm = (
    <Card>
      <CardBody>
        <FormGroup>
          <Label for="search">Company Name</Label>
          <Select
            styles={customStyles}
            className="react-select info"
            classNamePrefix="react-select"
            onChange={(value) => setCompanyName(value)}
            options={searchOptions}
          />
        </FormGroup>
        <div className="form-row">
          <Button color="primary" onClick={handleOnClickSearch}>
            Search
          </Button>
        </div>
      </CardBody>
    </Card>
  );
  const overviewPane = (
    <div ref={refToConvertTab}>
      <h4 className="h5 text-light text-center">
        {overviewApiData.description}
      </h4>
      <Row>
        <Col>
          <NumberCard
            label={overviewDataLabels[0].label}
            mainValue={companyApiData.ARR}
            byLine={overviewDataLabels[0].byLine}
            sentiment="good"
            isVisible
          />
        </Col>
        <Col>
          <NumberCard
            label={overviewDataLabels[1].label}
            mainValue={companyApiData.NRR}
            byLine={overviewDataLabels[1].byLine}
            sentiment="bad"
            isVisible
          />
        </Col>
        <Col>
          <NumberCard
            label={overviewDataLabels[2].label}
            mainValue={companyApiData.Customers}
            byLine={overviewDataLabels[2].byLine}
            isVisible
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <CardTitle tag="h3">
                <i className="tim-icons icon-bulb-63" />
                Sentiment by Bert
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <Col>
                  <h5>Sentiment</h5>
                </Col>
                <Col>
                  <h5>Probabality</h5>
                </Col>
                <Col>
                  <h5>Provider</h5>
                </Col>
              </Row>
              
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const metricsPane = (
    <div ref={refToConvertTab}>
      <br />
      <Row className="text-center">
        <Col md="4">
          <FormGroup>
            <ReactDatetime
              inputProps={{
                className: "form-control",
                placeholder: "From Date",
              }}
              timeFormat={false}
              onChange={(value) => setFromFillingDate(value)}
            />
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup>
            <ReactDatetime
              inputProps={{
                className: "form-control",
                placeholder: "To Date",
              }}
              timeFormat={false}
              onChange={(value) => setToFillingDate(value)}
            />
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup>
            <Button
              color="primary"
              onClick={() => {
                if (toFillingDate > fromFillingDate)
                  filterDatapoints(fromFillingDate, toFillingDate);
                else alert("Invalid dates");
              }}
            >
              Filter by Filling Date
            </Button>
          </FormGroup>
        </Col>
      </Row>
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
            value={multipleSelect}
            onChange={(value) => {
              if (value == null) setMultipleSelect([]);
              else setMultipleSelect(value);
            }}
            options={timeseriesChartLabels}
          />
        </Col>
        <Row>
          <div></div>
        </Row>
        <Col>
          <ChartCard
            type="line"
            label={timeseriesChartLabels[0].label}
            mainValue={companyApiData.ARR}
            chartObject={chartData(
              timeSeriesApiData.quarTS,
              timeSeriesApiData.arrTS,
              start,
              end
            )}
            isVisible={multipleSelect.some(
              (selection) => selection.value === timeseriesChartLabels[0].value
            )}
          />
        </Col>
        <Col>
          <ChartCard
            type="line"
            label={timeseriesChartLabels[1].label}
            mainValue={companyApiData.NRR}
            chartObject={chartData(
              timeSeriesApiData.quarTS,
              timeSeriesApiData.nrrTS,
              start,
              end
            )}
            isVisible={multipleSelect.some(
              (selection) => selection.value === timeseriesChartLabels[1].value
            )}
          />
        </Col>
        <Col>
          <ChartCard
            type="line"
            label={timeseriesChartLabels[2].label}
            mainValue={companyApiData.Customers}
            chartObject={chartData(
              timeSeriesApiData.quarTS,
              timeSeriesApiData.custTS,
              start,
              end
            )}
            isVisible={multipleSelect.some(
              (selection) => selection.value === timeseriesChartLabels[2].value
            )}
          />
        </Col>
        <Col>
          <ChartCard
            type="line"
            label={timeseriesChartLabels[3].label}
            mainValue=""
            chartObject={chartData(
              timeSeriesApiData.quarTS,
              timeSeriesApiData.smTS,
              start,
              end
            )}
            isVisible={multipleSelect.some(
              (selection) => selection.value === timeseriesChartLabels[3].value
            )}
          />
        </Col>
        <Col>
          <ChartCard
            type="line"
            label={timeseriesChartLabels[4].label}
            mainValue=""
            chartObject={chartData(
              timeSeriesApiData.quarTS,
              timeSeriesApiData.empTS,
              start,
              end
            )}
            isVisible={multipleSelect.some(
              (selection) => selection.value === timeseriesChartLabels[4].value
            )}
          />
        </Col>
        <Col>
          <Card className="col">
            <CardHeader>
              <h5 className="card-category">Link to respective Fillings</h5>
              <CardTitle tag="h3">Data source</CardTitle>
            </CardHeader>
            <div
              aria-multiselectable={true}
              className="card-collapse"
              id="accordion"
              role="tablist"
            >
              <Card className="card-plain">
                <CardHeader role="tab">
                  <a
                    aria-expanded={openedCollapseOne}
                    href="#pablo"
                    data-parent="#accordion"
                    data-toggle="collapse"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenedCollapseOne(!openedCollapseOne);
                    }}
                  >
                    Filling wise references
                    <i className="tim-icons icon-minimal-down" />
                  </a>
                </CardHeader>
                <Collapse
                  role="tabpanel"
                  isOpen={openedCollapseOne}
                  className="text-center text-muted"
                >
                  <Row>
                    <Col>
                      <h4>Filling Date</h4>
                    </Col>
                    <Col>
                      <h4>Link to Filling</h4>
                    </Col>
                  </Row>
                  {Boolean(timeSeriesApiData.srcTS) &&
                    timeSeriesApiData.srcTS.map((item, i) => {
                      return (
                        <Row key={i}>
                          <Col>
                            <h5>{timeSeriesApiData.quarTS[i]}</h5>
                          </Col>
                          <Col>
                            <a
                              href={item}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Link to Filling
                            </a>
                          </Col>
                        </Row>
                      );
                    })}
                </Collapse>
              </Card>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
  const companyDataElement = (
    <>
      <div ref={refToConvertFull}>
        <div className="container full-width">
          <Row>
            <Col className="ml-auto mr-auto" md="12">
              <Card className="card-plain card-subcategories">
                <CardHeader>
                  <CardTitle className="text-center mt-5" tag="h1">
                    <h1 className="text-white bold text-center">
                      <span style={{ verticalAlign: "middle" }}>
                        {companyName.label}
                      </span>
                      {"  "}
                      <span
                        style={{
                          color: "black",
                          backgroundColor: "white",
                          borderRadius: "10px",
                          fontSize: "70%",
                          verticalAlign: "middle",
                        }}
                      >
                        {ticker}
                      </span>
                    </h1>
                  </CardTitle>
                  <div className="row">
                    {/* <div className="flex bg-light mt-auto">{companyName}</div> */}
                    <PrintBtn refToConvert={refToConvertFull} />
                  </div>
                </CardHeader>
                <CardBody>
                  <Nav
                    className="nav-pills-info nav-pills-icons justify-content-center"
                    pills
                  >
                    <NavItem>
                      <NavLink
                        data-toggle="tab"
                        className={naviTab === 1 ? "active" : ""}
                        onClick={() => setNaviTab(1)}
                      >
                        <i className="tim-icons icon-zoom-split" />
                        Overview
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        data-toggle="tab"
                        className={naviTab === 2 ? "active" : ""}
                        onClick={() => setNaviTab(2)}
                      >
                        <i className="tim-icons icon-paper" />
                        Deep Dive
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        data-toggle="tab"
                        className={naviTab === 3 ? "active" : ""}
                        onClick={() => setNaviTab(3)}
                      >
                        <i className="tim-icons icon-paper" />
                        Highlights
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        data-toggle="tab"
                        className={naviTab === 4 ? "active" : ""}
                        onClick={() => setNaviTab(4)}
                      >
                        <i className="tim-icons icon-paper" />
                        Filling Explorer
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent
                    className="tab-space tab-subcategories"
                    activeTab={naviTab}
                  >
                    <TabPane tabId={1}>{overviewPane}</TabPane>
                    <TabPane tabId={2}>{metricsPane}</TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
  return (
    <>
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <LoadingOverlay
        active={isLoading}
        spinner
        text="Fetching..."
        styles={{
          wrapper: {
            width: "100%",
            height: "100%",
          },
        }}
        className="content"
      >
        <div className="content full-page col-lg-12">
          <blockquote className="blockquote text-center">
            <h1 className="mb-2">SEFASSC</h1>
            <h3 className="mb-0">SEC Filing Analyzer for SaaS Companies</h3>
          </blockquote>
          <div className="">{isFetched ? companyDataElement : searchForm}</div>
        </div>
      </LoadingOverlay>
    </>
  );
};

export default Dashboard;

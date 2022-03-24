/* eslint-disable jsx-a11y/anchor-is-valid */
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
  getSentimentByTicker,
  getTwitByTicker,
  getSectionByTicker,
  getQnaByTicker,
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

  const [isOpen, setIsOpen] = useState(null);
  const [lists, setLists] = useState([]);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [naviTab, setNaviTab] = useState(1);
  const [chartTabs, setChartTabs] = useState(1);
  const [naviTab1, setNaviTab1] = useState(1);
  const [naviTab2, setNaviTab2] = useState(1);
  const [naviTab3, setNaviTab3] = useState(1);
  const notificationAlertRef = React.useRef(null);
  const refToConvertFull = React.createRef();
  const refToConvertTab = React.createRef();
  const [companyApiData, setCompanyApiData] = useState({});
  const [overviewApiData, setOverviewApiData] = useState({});
  const [sentimentApiData, setSentimentApiData] = useState({
    finbSenti: {},
    dictSenti: {},
  });
  const [openedCollapseOne, setOpenedCollapseOne] = useState(null);
  const [ticker, setTicker] = useState("");
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(100);
  const [fromFillingDate, setFromFillingDate] = useState("");
  const [toFillingDate, setToFillingDate] = useState("");
  const [tagsinput, setTagsinput] = useState(["twitter", "trends"]);
  const [secApiData, setSecApiData] = useState({});
  const [timeSeriesApiData, setTimeSeriesApiData] = useState({
    quarTS: [1],
    arrTS: [1],
    custTS: [1],
    empTS: [1],
    nrrTS: [1],
    smTS: [1],
    srcTS: [1],
    pbTS: [1],
    icacTS: [1],
    darr: [],
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
  const setSecData = async () => {
    const secData = await getSectionByTicker(ticker);
    setSecApiData(secData?.sectionwise);
  };

  const setSentimentData = async () => {
    const sentimentData = await getSentimentByTicker(ticker);
    if (sentimentData.dictSenti === "")
      setSentimentApiData({
        finbSenti: {},
        dictSenti: {},
      });
    else setSentimentApiData(sentimentData);
  };

  const settwitterdata = async () => {
    const twitdata = await getTwitByTicker(ticker);
    setTagsinput(twitdata.trendingWords || []);
  };

  const setqnadata = async () => {
    const qnadata = await getQnaByTicker(ticker);
    setLists(qnadata.qna);
    setSummary(qnadata.summary);
  };

  useEffect(() => {
    if (ticker !== "") {
      setOverviewData();
      setTimeSeriesData();
      setSentimentData();
      settwitterdata();
      setqnadata();
      setSecData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticker]);

  const handleToggle = (id) => {
    if (isOpen === id) {
      setIsOpen(null);
    } else {
      setIsOpen(id);
    }
  };

  const handleOnClickSearch = async () => {
    setIsLoading(true);
    if (companyName.value.length === 0) {
      sendAlertNotification("Please select a company");
      setIsLoading(false);
      return;
    }
    const companyResult = await getCompanyByName(companyName.label);
    setCompanyApiData(companyResult);
    setTicker(companyResult.ticker);
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
      <h4 className="h4 text-light text-center">
        {overviewApiData.description}
      </h4>
      <Row>
        <Col>
          <NumberCard
            label={overviewDataLabels[0].label}
            mainValue={companyApiData.ARR || "--"}
            byLine={overviewDataLabels[0].byLine}
            isVisible
          />
        </Col>
        <Col>
          <NumberCard
            label={overviewDataLabels[1].label}
            mainValue={companyApiData.NRR || "--"}
            byLine={overviewDataLabels[1].byLine}
            sentiment={
              parseFloat(companyApiData?.NRR) > 90
                ? "good"
                : parseFloat(companyApiData?.NRR) > 70
                ? "neutral"
                : "bad"
            }
            isVisible
          />
        </Col>
        <Col>
          <NumberCard
            label={overviewDataLabels[2].label}
            mainValue={companyApiData.Customers || "--"}
            byLine={overviewDataLabels[2].byLine}
            isVisible
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <NumberCard
            label="Magic Number"
            mainValue={timeSeriesApiData?.mg || "--"}
            byLine="For the latest quarter"
            isVisible
            sentiment={
              parseFloat(timeSeriesApiData?.mg) > 0.75
                ? "good"
                : parseFloat(timeSeriesApiData?.mg) > 0.5
                ? "neutral"
                : "bad"
            }
          />
        </Col>
        <Col>
          <NumberCard
            label="Payback period (months)"
            mainValue={timeSeriesApiData?.pbTSlast || "--"}
            byLine="For the latest quarter"
            isVisible
            sentiment={
              parseInt(timeSeriesApiData?.pbTSlast) < 12 ? "good" : "bad"
            }
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <NumberCard
            label="CAC Ratio"
            mainValue={timeSeriesApiData?.cac || "--"}
            byLine="For the latest quarter"
            isVisible
          />
        </Col>
        <Col>
          <NumberCard
            label="LTV:CAC Ratio"
            mainValue={timeSeriesApiData?.ltvcac || "--"}
            byLine="For the latest quarter"
            isVisible
            sentiment={
              parseFloat(timeSeriesApiData?.ltvcac) > 3
                ? "good"
                : parseFloat(timeSeriesApiData?.ltvcac) > 1
                ? "neutral"
                : "bad"
            }
          />
        </Col>
      </Row>
      {Boolean(sentimentApiData?.dictSenti !== "") && (
        <>
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <CardTitle tag="h3">Sentiments using FinBERT</CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col>
                      <h5>Sentiment</h5>
                    </Col>
                    <Col>
                      <h5>Proportion</h5>
                    </Col>
                    <Col>
                      <h5>Sentiment</h5>
                    </Col>
                    <Col>
                      <h5>Proportion</h5>
                    </Col>
                    <Col>
                      <h5>Sentiment</h5>
                    </Col>
                    <Col>
                      <h5>Proportion</h5>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <b>Positive</b>
                    </Col>
                    <Col>
                      {Math.round(
                        sentimentApiData?.finbSenti?.positive * 1000
                      ) / 1000 || "--"}
                    </Col>
                    <Col>
                      <b>Negative</b>
                    </Col>
                    <Col>
                      {Math.round(
                        sentimentApiData?.finbSenti?.negative * 1000
                      ) / 1000 || "--"}
                    </Col>
                    <Col>
                      <b>Neutral</b>
                    </Col>
                    <Col>
                      {Math.round(sentimentApiData?.finbSenti?.neutral * 1000) /
                        1000 || "--"}
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <CardTitle tag="h3">Sentiments using Wordlist</CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col>
                      <h5>Sentiment</h5>
                    </Col>
                    <Col>
                      <h5>Proportion</h5>
                    </Col>
                    <Col>
                      <h5>Sentiment</h5>
                    </Col>
                    <Col>
                      <h5>Proportion</h5>
                    </Col>
                    <Col>
                      <h5>Sentiment</h5>
                    </Col>
                    <Col>
                      <h5>Proportion</h5>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <b>Positive</b>
                    </Col>
                    <Col>
                      {Math.round(
                        sentimentApiData?.dictSenti?.Positive * 1000
                      ) / 1000 || "--"}
                    </Col>
                    <Col>
                      <b>Negative</b>
                    </Col>
                    <Col>
                      {Math.round(
                        sentimentApiData?.dictSenti?.Negative * 1000
                      ) / 1000 || "--"}
                    </Col>
                    <Col>
                      <b>Uncertainty</b>
                    </Col>
                    <Col>
                      {Math.round(
                        sentimentApiData?.dictSenti?.Uncertainty * 1000
                      ) / 1000 || "--"}
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <b>Constraining</b>
                    </Col>
                    <Col>
                      {Math.round(
                        sentimentApiData?.dictSenti?.Constraining * 1000
                      ) / 1000 || "--"}
                    </Col>
                    <Col>
                      <b>Litigious</b>
                    </Col>
                    <Col>
                      {Math.round(
                        sentimentApiData?.dictSenti?.Litigious * 1000
                      ) / 1000 || "--"}
                    </Col>
                    <Col>
                      <b>Weak modal</b>
                    </Col>
                    <Col>
                      {Math.round(
                        sentimentApiData?.dictSenti?.Weak_Modal * 1000
                      ) / 1000 || "--"}
                    </Col>
                  </Row>
                  <Row>
                    <Col className="col-md-2">
                      <b>Strong modal</b>
                    </Col>
                    <Col className="col-md-2">
                      {Math.round(
                        sentimentApiData?.dictSenti?.Strong_Modal * 1000
                      ) / 1000 || "--"}
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </>
      )}
      <Card>
        <Row>
          <Col>
            <CardHeader>
              <CardTitle tag="h3">Twitter trends Tags</CardTitle>
            </CardHeader>
          </Col>
        </Row>
        <Row>
          <CardBody style={{ paddingLeft: 30 }}>
            {tagsinput.length === 0
              ? "No Data Available"
              : tagsinput?.map((item) => {
                  return (
                    <span
                      style={{
                        color: "black",
                        backgroundColor: "white",
                        borderRadius: "2px",
                        verticalAlign: "middle",
                        marginRight: "5px",
                        padding: "2px",
                      }}
                    >
                      {item.toUpperCase()}
                    </span>
                  );
                })}
          </CardBody>
        </Row>
      </Card>
      <Row>
        <Col>
          <NumberCard
            label="EPS ($)"
            mainValue={overviewApiData?.eps || "--"}
            byLine=""
            isVisible
          />
        </Col>
        <Col>
          <NumberCard
            label="Profit Margin"
            mainValue={
              (parseInt(overviewApiData?.profitmargin * 10000) / 100 || "--") +
              "%"
            }
            byLine=""
            isVisible
          />
        </Col>
        <Col>
          <NumberCard
            label="Operating margin"
            mainValue={
              (parseInt(overviewApiData?.operatingmarginttm * 10000) / 100 ||
                "--") + "%"
            }
            byLine=""
            isVisible
          />
        </Col>
        <Col>
          <NumberCard
            label="P/E"
            mainValue={
              overviewApiData?.pe === "None"
                ? "--"
                : overviewApiData?.pe || "--"
            }
            byLine=""
            isVisible
          />
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
        <Card style={{ backgroundColor: "#1e1e2b" }}>
          <CardHeader>
            <h5 className="card-category">Navigattion by Metrics</h5>
            <CardTitle tag="h3">Key SaaS Goals</CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md="2">
                <Nav className="nav-pills-info flex-column" pills>
                  <NavItem>
                    <NavLink
                      data-toggle="tab"
                      className={chartTabs === 1 ? "active" : ""}
                      onClick={() => setChartTabs(1)}
                    >
                      <i className="tim-icons icon-chart-bar-32" />
                      Growth
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      data-toggle="tab"
                      className={chartTabs === 2 ? "active" : ""}
                      onClick={() => setChartTabs(2)}
                    >
                      <i className="tim-icons icon-single-copy-04" />
                      Profitability
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      data-toggle="tab"
                      className={chartTabs === 3 ? "active" : ""}
                      onClick={() => setChartTabs(3)}
                    >
                      <i className="tim-icons icon-coins" />
                      Cash
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
              <Col md="10">
                <TabContent activeTab={chartTabs}>
                  <TabPane tabId={1}>
                    <Nav
                      className="nav-pills-info nav-pills-icons justify-content-center"
                      pills
                    >
                      <NavItem>
                        <NavLink
                          data-toggle="tab"
                          className={naviTab1 === 1 ? "active" : ""}
                          onClick={() => setNaviTab1(1)}
                        >
                          Annual Growth
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          data-toggle="tab"
                          className={naviTab1 === 2 ? "active" : ""}
                          onClick={() => setNaviTab1(2)}
                        >
                          Revenue Retention
                        </NavLink>
                      </NavItem>
                    </Nav>
                    <TabContent
                      className="tab-space tab-subcategories"
                      activeTab={naviTab1}
                    >
                      <TabPane tabId={1}>
                        <Row>
                          <Col className="col-md-12">
                            <ChartCard
                              type="line"
                              label="Difference in ARR"
                              mainValue=""
                              chartObject={chartData(
                                timeSeriesApiData.quarTS,
                                timeSeriesApiData.darr,
                                start,
                                end
                              )}
                              isVisible
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col className="col-md-12">
                            <ChartCard
                              type="line"
                              label={timeseriesChartLabels[2].label}
                              mainValue=""
                              chartObject={chartData(
                                timeSeriesApiData.quarTS,
                                timeSeriesApiData.custTS,
                                start,
                                end
                              )}
                              isVisible
                            />
                          </Col>
                        </Row>
                      </TabPane>
                      <TabPane tabId={2}>
                        <Row>
                          <Col className="col-md-12">
                            <ChartCard
                              type="line"
                              label={timeseriesChartLabels[1].label}
                              mainValue=""
                              chartObject={chartData(
                                timeSeriesApiData.quarTS,
                                timeSeriesApiData.nrrTS,
                                start,
                                end
                              )}
                              isVisible
                            />
                          </Col>
                        </Row>
                      </TabPane>
                    </TabContent>
                  </TabPane>
                  <TabPane tabId={2}>
                    <Nav
                      className="nav-pills-info nav-pills-icons justify-content-center"
                      pills
                    >
                      <NavItem>
                        <NavLink
                          data-toggle="tab"
                          className={naviTab2 === 1 ? "active" : ""}
                          onClick={() => setNaviTab2(1)}
                        >
                          Customer Profitability
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          data-toggle="tab"
                          className={naviTab2 === 2 ? "active" : ""}
                          onClick={() => setNaviTab2(2)}
                        >
                          Overall Profitability
                        </NavLink>
                      </NavItem>
                    </Nav>
                    <TabContent
                      className="tab-space tab-subcategories"
                      activeTab={naviTab2}
                    >
                      <TabPane tabId={1}>
                        <Row>
                          <Col className="col-md-12">
                            <ChartCard
                              type="line"
                              label={timeseriesChartLabels[4].label}
                              mainValue=""
                              chartObject={chartData(
                                timeSeriesApiData.quarTS,
                                timeSeriesApiData.icacTS,
                                start,
                                end
                              )}
                              isVisible
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col className="col-md-12">
                            <ChartCard
                              type="line"
                              label={timeseriesChartLabels[5].label}
                              mainValue=""
                              chartObject={chartData(
                                timeSeriesApiData.quarTS,
                                timeSeriesApiData.ltvTS,
                                start,
                                end
                              )}
                              isVisible
                            />
                          </Col>
                        </Row>
                      </TabPane>
                      <TabPane tabId={2}>
                        <Row>
                          <Col className="col-md-12">
                            <ChartCard
                              type="line"
                              label={timeseriesChartLabels[0].label}
                              mainValue=""
                              chartObject={chartData(
                                timeSeriesApiData.quarTS,
                                timeSeriesApiData.arrTS,
                                start,
                                end
                              )}
                              isVisible
                            />
                          </Col>
                        </Row>
                      </TabPane>
                    </TabContent>
                  </TabPane>
                  <TabPane tabId={3}>
                    <Nav
                      className="nav-pills-info nav-pills-icons justify-content-center"
                      pills
                    >
                      <NavItem>
                        <NavLink
                          data-toggle="tab"
                          className={naviTab3 === 1 ? "active" : ""}
                          onClick={() => setNaviTab3(1)}
                        >
                          Months to Recover CAC
                        </NavLink>
                      </NavItem>
                    </Nav>
                    <TabContent
                      className="tab-space tab-subcategories"
                      activeTab={naviTab3}
                    >
                      <TabPane tabId={1}>
                        <Row>
                          <Col className="col-md-12">
                            <ChartCard
                              type="line"
                              label={timeseriesChartLabels[3].label}
                              mainValue=""
                              chartObject={chartData(
                                timeSeriesApiData.quarTS,
                                timeSeriesApiData.pbTS,
                                start,
                                end
                              )}
                              isVisible
                            />
                          </Col>
                        </Row>
                      </TabPane>
                    </TabContent>
                  </TabPane>
                </TabContent>
              </Col>
            </Row>
          </CardBody>
        </Card>
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
                  <div>
                    <Button
                      onClick={() => {
                        window.location.reload();
                      }}
                    >
                      Search Again
                    </Button>
                    <PrintBtn
                      className="col-md-6"
                      refToConvert={refToConvertFull}
                    />
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
                    <TabPane tabId={3}>
                      <div
                        aria-multiselectable={true}
                        className="card-collapse"
                        id="accordion"
                        role="tablist"
                      >
                        {lists.length === 0
                          ? "No Data Available"
                          : lists.map((list) => (
                              <Card key={lists.indexOf(list)}>
                                <CardHeader
                                  onClick={() =>
                                    handleToggle(lists.indexOf(list))
                                  }
                                >
                                  <h4>{list.question}</h4>
                                </CardHeader>
                                <Collapse
                                  isOpen={isOpen === lists.indexOf(list)}
                                >
                                  <CardBody>
                                    <p>{list.answer}</p>
                                  </CardBody>
                                </Collapse>
                              </Card>
                            ))}
                      </div>
                    </TabPane>
                    <TabPane tabId={4}>
                      <div>
                        <Card>
                          <CardHeader>
                            <CardTitle>Summary</CardTitle>
                          </CardHeader>
                          <CardBody>{summary || "No Data Available"}</CardBody>
                        </Card>
                        <Row>
                          <Col>
                            <Card className="col">
                              <CardHeader>
                                <h5 className="card-category">
                                  Skim through several sections of Filling
                                </h5>
                                <CardTitle tag="h3">
                                  Section Wise Viewer
                                </CardTitle>
                              </CardHeader>
                              <div
                                aria-multiselectable={true}
                                className="card-collapse"
                                id="accordion"
                                role="tablist"
                              >
                                <Card className="">
                                  <CardHeader role="tab">
                                    <a
                                      aria-expanded={openedCollapseOne === 1}
                                      data-parent="#accordion"
                                      data-toggle="collapse"
                                      onClick={() => {
                                        setOpenedCollapseOne(1);
                                      }}
                                    >
                                      Item 1
                                      <i className="tim-icons icon-minimal-down" />
                                    </a>
                                  </CardHeader>
                                  <Collapse
                                    role="tabpanel"
                                    isOpen={openedCollapseOne === 1}
                                    className="text-muted"
                                  >
                                    {secApiData?.i1 || "--"}
                                  </Collapse>
                                </Card>
                                <Card className="">
                                  <CardHeader role="tab">
                                    <a
                                      aria-expanded={openedCollapseOne === 11}
                                      data-parent="#accordion"
                                      data-toggle="collapse"
                                      onClick={() => {
                                        setOpenedCollapseOne(11);
                                      }}
                                    >
                                      Item 1A
                                      <i className="tim-icons icon-minimal-down" />
                                    </a>
                                  </CardHeader>
                                  <Collapse
                                    role="tabpanel"
                                    isOpen={openedCollapseOne === 11}
                                    className="text-muted"
                                  >
                                    {secApiData?.i1a || "--"}
                                  </Collapse>
                                </Card>
                                <Card className="">
                                  <CardHeader role="tab">
                                    <a
                                      aria-expanded={openedCollapseOne === 12}
                                      data-parent="#accordion"
                                      data-toggle="collapse"
                                      onClick={() => {
                                        setOpenedCollapseOne(12);
                                      }}
                                    >
                                      Item 1B
                                      <i className="tim-icons icon-minimal-down" />
                                    </a>
                                  </CardHeader>
                                  <Collapse
                                    role="tabpanel"
                                    isOpen={openedCollapseOne === 12}
                                    className="text-muted"
                                  >
                                    {secApiData?.i1b || "--"}
                                  </Collapse>
                                </Card>
                                <Card className="">
                                  <CardHeader role="tab">
                                    <a
                                      aria-expanded={openedCollapseOne === 2}
                                      data-parent="#accordion"
                                      data-toggle="collapse"
                                      onClick={() => {
                                        setOpenedCollapseOne(2);
                                      }}
                                    >
                                      Item 2
                                      <i className="tim-icons icon-minimal-down" />
                                    </a>
                                  </CardHeader>
                                  <Collapse
                                    role="tabpanel"
                                    isOpen={openedCollapseOne === 2}
                                    className="text-muted"
                                  >
                                    {secApiData?.i2 || "--"}
                                  </Collapse>
                                </Card>
                                <Card className="">
                                  <CardHeader role="tab">
                                    <a
                                      aria-expanded={openedCollapseOne === 3}
                                      data-parent="#accordion"
                                      data-toggle="collapse"
                                      onClick={() => {
                                        setOpenedCollapseOne(3);
                                      }}
                                    >
                                      Item 3
                                      <i className="tim-icons icon-minimal-down" />
                                    </a>
                                  </CardHeader>
                                  <Collapse
                                    role="tabpanel"
                                    isOpen={openedCollapseOne === 3}
                                    className="text-muted"
                                  >
                                    {secApiData?.i3 || "--"}
                                  </Collapse>
                                </Card>
                                <Card className="">
                                  <CardHeader role="tab">
                                    <a
                                      aria-expanded={openedCollapseOne === 4}
                                      data-parent="#accordion"
                                      data-toggle="collapse"
                                      onClick={() => {
                                        setOpenedCollapseOne(4);
                                      }}
                                    >
                                      Item 4
                                      <i className="tim-icons icon-minimal-down" />
                                    </a>
                                  </CardHeader>
                                  <Collapse
                                    role="tabpanel"
                                    isOpen={openedCollapseOne === 4}
                                    className="text-muted"
                                  >
                                    {secApiData?.i4 || "--"}
                                  </Collapse>
                                </Card>
                                <Card className="">
                                  <CardHeader role="tab">
                                    <a
                                      aria-expanded={openedCollapseOne === 5}
                                      data-parent="#accordion"
                                      data-toggle="collapse"
                                      onClick={() => {
                                        setOpenedCollapseOne(5);
                                      }}
                                    >
                                      Item 5
                                      <i className="tim-icons icon-minimal-down" />
                                    </a>
                                  </CardHeader>
                                  <Collapse
                                    role="tabpanel"
                                    isOpen={openedCollapseOne === 5}
                                    className="text-muted"
                                  >
                                    {secApiData?.i5 || "--"}
                                  </Collapse>
                                </Card>
                                <Card className="">
                                  <CardHeader role="tab">
                                    <a
                                      aria-expanded={openedCollapseOne === 6}
                                      data-parent="#accordion"
                                      data-toggle="collapse"
                                      onClick={() => {
                                        setOpenedCollapseOne(6);
                                      }}
                                    >
                                      Item 6
                                      <i className="tim-icons icon-minimal-down" />
                                    </a>
                                  </CardHeader>
                                  <Collapse
                                    role="tabpanel"
                                    isOpen={openedCollapseOne === 6}
                                    className="text-muted"
                                  >
                                    {secApiData?.i6 || "--"}
                                  </Collapse>
                                </Card>
                                <Card className="">
                                  <CardHeader role="tab">
                                    <a
                                      aria-expanded={openedCollapseOne === 7}
                                      data-parent="#accordion"
                                      data-toggle="collapse"
                                      onClick={() => {
                                        setOpenedCollapseOne(7);
                                      }}
                                    >
                                      Item 7
                                      <i className="tim-icons icon-minimal-down" />
                                    </a>
                                  </CardHeader>
                                  <Collapse
                                    role="tabpanel"
                                    isOpen={openedCollapseOne === 7}
                                    className="text-muted"
                                  >
                                    {secApiData?.i7 || "--"}
                                  </Collapse>
                                </Card>
                                <Card className="">
                                  <CardHeader role="tab">
                                    <a
                                      aria-expanded={openedCollapseOne === 71}
                                      data-parent="#accordion"
                                      data-toggle="collapse"
                                      onClick={() => {
                                        setOpenedCollapseOne(71);
                                      }}
                                    >
                                      Item 7A
                                      <i className="tim-icons icon-minimal-down" />
                                    </a>
                                  </CardHeader>
                                  <Collapse
                                    role="tabpanel"
                                    isOpen={openedCollapseOne === 71}
                                    className="text-muted"
                                  >
                                    {secApiData?.i7a || "--"}
                                  </Collapse>
                                </Card>
                                <Card className="">
                                  <CardHeader role="tab">
                                    <a
                                      aria-expanded={openedCollapseOne === 8}
                                      data-parent="#accordion"
                                      data-toggle="collapse"
                                      onClick={() => {
                                        setOpenedCollapseOne(8);
                                      }}
                                    >
                                      Item 8
                                      <i className="tim-icons icon-minimal-down" />
                                    </a>
                                  </CardHeader>
                                  <Collapse
                                    role="tabpanel"
                                    isOpen={openedCollapseOne === 8}
                                    className="text-muted"
                                  >
                                    {secApiData?.i8 || "--"}
                                  </Collapse>
                                </Card>
                                <Card className="">
                                  <CardHeader role="tab">
                                    <a
                                      aria-expanded={openedCollapseOne === 9}
                                      data-parent="#accordion"
                                      data-toggle="collapse"
                                      onClick={() => {
                                        setOpenedCollapseOne(9);
                                      }}
                                    >
                                      Item 9
                                      <i className="tim-icons icon-minimal-down" />
                                    </a>
                                  </CardHeader>
                                  <Collapse
                                    role="tabpanel"
                                    isOpen={openedCollapseOne === 9}
                                    className="text-muted"
                                  >
                                    {secApiData?.i9 || "--"}
                                  </Collapse>
                                </Card>
                                <Card className="">
                                  <CardHeader role="tab">
                                    <a
                                      aria-expanded={openedCollapseOne === 91}
                                      data-parent="#accordion"
                                      data-toggle="collapse"
                                      onClick={() => {
                                        setOpenedCollapseOne(91);
                                      }}
                                    >
                                      Item 9A
                                      <i className="tim-icons icon-minimal-down" />
                                    </a>
                                  </CardHeader>
                                  <Collapse
                                    role="tabpanel"
                                    isOpen={openedCollapseOne === 91}
                                    className="text-muted"
                                  >
                                    {secApiData?.i9a || "--"}
                                  </Collapse>
                                </Card>
                                <Card className="">
                                  <CardHeader role="tab">
                                    <a
                                      aria-expanded={openedCollapseOne === 92}
                                      data-parent="#accordion"
                                      data-toggle="collapse"
                                      onClick={() => {
                                        setOpenedCollapseOne(92);
                                      }}
                                    >
                                      Item 9B
                                      <i className="tim-icons icon-minimal-down" />
                                    </a>
                                  </CardHeader>
                                  <Collapse
                                    role="tabpanel"
                                    isOpen={openedCollapseOne === 92}
                                    className="text-muted"
                                  >
                                    {secApiData?.i9b || "--"}
                                  </Collapse>
                                </Card>
                                <Card className="">
                                  <CardHeader role="tab">
                                    <a
                                      aria-expanded={openedCollapseOne === 93}
                                      data-parent="#accordion"
                                      data-toggle="collapse"
                                      onClick={() => {
                                        setOpenedCollapseOne(93);
                                      }}
                                    >
                                      Item 9C
                                      <i className="tim-icons icon-minimal-down" />
                                    </a>
                                  </CardHeader>
                                  <Collapse
                                    role="tabpanel"
                                    isOpen={openedCollapseOne === 93}
                                    className="text-muted"
                                  >
                                    {secApiData?.i9c || "--"}
                                  </Collapse>
                                </Card>
                                <Card className="">
                                  <CardHeader role="tab">
                                    <a
                                      aria-expanded={openedCollapseOne === 10}
                                      data-parent="#accordion"
                                      data-toggle="collapse"
                                      onClick={() => {
                                        setOpenedCollapseOne(10);
                                      }}
                                    >
                                      Item 10
                                      <i className="tim-icons icon-minimal-down" />
                                    </a>
                                  </CardHeader>
                                  <Collapse
                                    role="tabpanel"
                                    isOpen={openedCollapseOne === 10}
                                    className="text-muted"
                                  >
                                    {secApiData?.i10 || "--"}
                                  </Collapse>
                                </Card>
                                <Card className="">
                                  <CardHeader role="tab">
                                    <a
                                      aria-expanded={openedCollapseOne === 110}
                                      data-parent="#accordion"
                                      data-toggle="collapse"
                                      onClick={() => {
                                        setOpenedCollapseOne(110);
                                      }}
                                    >
                                      Item 11
                                      <i className="tim-icons icon-minimal-down" />
                                    </a>
                                  </CardHeader>
                                  <Collapse
                                    role="tabpanel"
                                    isOpen={openedCollapseOne === 110}
                                    className="text-muted"
                                  >
                                    {secApiData?.i11 || "--"}
                                  </Collapse>
                                </Card>
                                <Card className="">
                                  <CardHeader role="tab">
                                    <a
                                      aria-expanded={openedCollapseOne === 12}
                                      data-parent="#accordion"
                                      data-toggle="collapse"
                                      onClick={() => {
                                        setOpenedCollapseOne(12);
                                      }}
                                    >
                                      Item 12
                                      <i className="tim-icons icon-minimal-down" />
                                    </a>
                                  </CardHeader>
                                  <Collapse
                                    role="tabpanel"
                                    isOpen={openedCollapseOne === 12}
                                    className="text-muted"
                                  >
                                    {secApiData?.i12 || "--"}
                                  </Collapse>
                                </Card>
                                <Card className="">
                                  <CardHeader role="tab">
                                    <a
                                      aria-expanded={openedCollapseOne === 13}
                                      data-parent="#accordion"
                                      data-toggle="collapse"
                                      onClick={() => {
                                        setOpenedCollapseOne(13);
                                      }}
                                    >
                                      Item 13
                                      <i className="tim-icons icon-minimal-down" />
                                    </a>
                                  </CardHeader>
                                  <Collapse
                                    role="tabpanel"
                                    isOpen={openedCollapseOne === 13}
                                    className="text-muted"
                                  >
                                    {secApiData?.i13 || "--"}
                                  </Collapse>
                                </Card>
                                <Card className="">
                                  <CardHeader role="tab">
                                    <a
                                      aria-expanded={openedCollapseOne === 14}
                                      data-parent="#accordion"
                                      data-toggle="collapse"
                                      onClick={() => {
                                        setOpenedCollapseOne(14);
                                      }}
                                    >
                                      Item 14
                                      <i className="tim-icons icon-minimal-down" />
                                    </a>
                                  </CardHeader>
                                  <Collapse
                                    role="tabpanel"
                                    isOpen={openedCollapseOne === 14}
                                    className="text-muted"
                                  >
                                    {secApiData?.i14 || "--"}
                                  </Collapse>
                                </Card>
                                <Card className="">
                                  <CardHeader role="tab">
                                    <a
                                      aria-expanded={openedCollapseOne === 15}
                                      data-parent="#accordion"
                                      data-toggle="collapse"
                                      onClick={() => {
                                        setOpenedCollapseOne(15);
                                      }}
                                    >
                                      Item 15
                                      <i className="tim-icons icon-minimal-down" />
                                    </a>
                                  </CardHeader>
                                  <Collapse
                                    role="tabpanel"
                                    isOpen={openedCollapseOne === 15}
                                    className="text-muted"
                                  >
                                    {secApiData?.i15 || "--"}
                                  </Collapse>
                                </Card>
                                <Card className="">
                                  <CardHeader role="tab">
                                    <a
                                      aria-expanded={openedCollapseOne === 16}
                                      data-parent="#accordion"
                                      data-toggle="collapse"
                                      onClick={() => {
                                        setOpenedCollapseOne(16);
                                      }}
                                    >
                                      Item 16
                                      <i className="tim-icons icon-minimal-down" />
                                    </a>
                                  </CardHeader>
                                  <Collapse
                                    role="tabpanel"
                                    isOpen={openedCollapseOne === 16}
                                    className="text-muted"
                                  >
                                    {secApiData?.i16 || "--"}
                                  </Collapse>
                                </Card>
                              </div>
                            </Card>
                          </Col>
                        </Row>
                      </div>
                    </TabPane>
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
            <h1 className="mb-2">SaaS Analyzer</h1>
            <h3 className="mb-0">SEC Filing Analyzer for SaaS Companies</h3>
          </blockquote>
          <div className="">{isFetched ? companyDataElement : searchForm}</div>
        </div>
      </LoadingOverlay>
    </>
  );
};

export default Dashboard;

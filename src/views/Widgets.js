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
  const [companyNameA, setCompanyNameA] = React.useState({
    value: "",
    label: "",
  });
  const [companyNameB, setCompanyNameB] = React.useState({
    value: "",
    label: "",
  });

  const [isOpen, setIsOpen] = useState(1);
  const [lists, setLists] = useState([]);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [naviTab, setNaviTab] = useState(1);
  const notificationAlertRef = React.useRef(null);
  const refToConvertFull = React.createRef();
  const refToConvertTab = React.createRef();
  const [sentimentApiData, setSentimentApiData] = useState({
    finbSenti: {},
    dictSenti: {},
  });
  const [openedCollapseOne, setOpenedCollapseOne] = useState(false);
  const [tickerA, setTickerA] = useState("");
  const [tickerB, setTickerB] = useState("");
  const [startA, setStartA] = useState(0);
  const [endA, setEndA] = useState(100);
  const [startB, setStartB] = useState(0);
  const [endB, setEndB] = useState(100);
  const [fromFillingDate, setFromFillingDate] = useState("");
  const [toFillingDate, setToFillingDate] = useState("");
  const [multipleSelect, setMultipleSelect] = useState(timeseriesChartLabels);
  const [tagsinput, setTagsinput] = useState(["twitter", "trends"]);
  const [sentimentElement, setSentimentElement] = useState(<></>);
  const [companyApiDataA, setCompanyApiDataA] = useState({});
  const [overviewApiDataA, setOverviewApiDataA] = useState({});
  const [timeSeriesApiDataA, setTimeSeriesApiDataA] = useState({
    quarTS: [1],
    arrTS: [1],
    custTS: [1],
    empTS: [1],
    nrrTS: [1],
    smTS: [1],
    srcTS: [1],
    pbTS: [1],
    icacTS: [1],
  });
  const [companyApiDataB, setCompanyApiDataB] = useState({});
  const [overviewApiDataB, setOverviewApiDataB] = useState({});
  const [timeSeriesApiDataB, setTimeSeriesApiDataB] = useState({
    quarTS: [1],
    arrTS: [1],
    custTS: [1],
    empTS: [1],
    nrrTS: [1],
    smTS: [1],
    srcTS: [1],
    pbTS: [1],
    icacTS: [1],
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
    const overviewResult = await getOverviewByTicker(tickerA);
    setOverviewApiDataA(overviewResult);
  };
  const setTimeSeriesData = async () => {
    const timeSeriesData = await getTimeSeriesByTicker(tickerA);
    setTimeSeriesApiDataA(timeSeriesData);
  };

  const setOverviewDatB = async () => {
    const overviewResult = await getOverviewByTicker(tickerB);
    setOverviewApiDataB(overviewResult);
  };
  const setTimeSeriesDatB = async () => {
    const timeSeriesData = await getTimeSeriesByTicker(tickerB);
    setTimeSeriesApiDataB(timeSeriesData);
  };

  useEffect(() => {
    if (tickerA !== "") {
      setOverviewData();
      setTimeSeriesData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickerA]);
  useEffect(() => {
    if (tickerB !== "") {
      setOverviewDatB();
      setTimeSeriesDatB();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickerB]);

  const handleToggle = (id) => {
    if (isOpen === id) {
      setIsOpen(null);
    } else {
      setIsOpen(id);
    }
  };

  const handleOnClickSearch = async () => {
    setIsLoading(true);
    if (companyNameA.value.length === 0 || companyNameB.value.length === 0) {
      sendAlertNotification("Please select company");
      setIsLoading(false);
      return;
    }
    if (companyNameA.value === companyNameB.value) {
      sendAlertNotification("Please select different company");
      setIsLoading(false);
      return;
    }
    const companyResultA = await getCompanyByName(companyNameA.label);
    setCompanyApiDataA(companyResultA);
    setTickerA(companyResultA.ticker);
    const companyResult = await getCompanyByName(companyNameB.label);
    setCompanyApiDataB(companyResult);
    setTickerB(companyResult.ticker);
    setIsLoading(false);
    setIsFetched(true);
  };
  const filterDatapoints = (from, to) => {
    filterDatapointsA(from, to);
    filterDatapointsB(from, to);
  };

  const filterDatapointsA = async (from, to) => {
    const fillingdates = timeSeriesApiDataA.quarTS;
    let startbool = false;
    let endbool = false;
    fillingdates.forEach((date, i) => {
      if (startbool && !endbool && Date.parse(date) >= Date.parse(to)) {
        setEndA(i);
        endbool = true;
      } else if (!startbool && Date.parse(date) >= Date.parse(from)) {
        startbool = true;
        setStartA(i);
      }
    });

    if (!startbool) alert("No Filling in this period");
    if (!endbool) setEndA(500);
  };

  const filterDatapointsB = async (from, to) => {
    const fillingdates = timeSeriesApiDataA.quarTS;
    let startbool = false;
    let endbool = false;
    fillingdates.forEach((date, i) => {
      if (startbool && !endbool && Date.parse(date) >= Date.parse(to)) {
        setEndB(i);
        endbool = true;
      } else if (!startbool && Date.parse(date) >= Date.parse(from)) {
        startbool = true;
        setStartB(i);
      }
    });

    if (!startbool) alert("No Filling in this period");
    if (!endbool) setEndB(500);
  };

  const searchForm = (
    <Card>
      <CardBody>
        <FormGroup>
          <Label for="search">Company Name A</Label>
          <Select
            styles={customStyles}
            className="react-select info"
            classNamePrefix="react-select"
            onChange={(value) => setCompanyNameA(value)}
            options={searchOptions}
          />
        </FormGroup>
        <FormGroup>
          <Label for="search">Company Name B</Label>
          <Select
            styles={customStyles}
            className="react-select info"
            classNamePrefix="react-select"
            onChange={(value) => setCompanyNameB(value)}
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
      <Row>
        <Col>
          <b>{companyNameA.label}</b>
        </Col>
        <Col>
          <b>{companyNameB.label}</b>
        </Col>
      </Row>
      <Row>
        <Col>
          <NumberCard
            label={overviewDataLabels[0].label}
            mainValue={companyApiDataA.ARR || "--"}
            byLine={overviewDataLabels[0].byLine}
            isVisible
          />
        </Col>
        <Col>
          <NumberCard
            label={overviewDataLabels[0].label}
            mainValue={companyApiDataB.ARR || "--"}
            byLine={overviewDataLabels[0].byLine}
            isVisible
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <NumberCard
            label={overviewDataLabels[1].label}
            mainValue={companyApiDataA.NRR || "--"}
            byLine={overviewDataLabels[1].byLine}
            sentiment={
              parseFloat(companyApiDataA?.NRR) > 90
                ? "good"
                : parseFloat(companyApiDataA?.NRR) > 70
                ? "neutral"
                : "bad"
            }
            isVisible
          />
        </Col>
        <Col>
          <NumberCard
            label={overviewDataLabels[1].label}
            mainValue={companyApiDataB.NRR || "--"}
            byLine={overviewDataLabels[1].byLine}
            sentiment={
              parseFloat(companyApiDataB?.NRR) > 90
                ? "good"
                : parseFloat(companyApiDataB?.NRR) > 70
                ? "neutral"
                : "bad"
            }
            isVisible
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <NumberCard
            label={overviewDataLabels[2].label}
            mainValue={companyApiDataA.Customers || "--"}
            byLine={overviewDataLabels[2].byLine}
            isVisible
          />
        </Col>
        <Col>
          <NumberCard
            label={overviewDataLabels[2].label}
            mainValue={companyApiDataB.Customers || "--"}
            byLine={overviewDataLabels[2].byLine}
            isVisible
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <NumberCard
            label="Magic Number"
            mainValue={timeSeriesApiDataA?.mg || "--"}
            byLine="For the latest quarter"
            isVisible
            sentiment={
              parseFloat(timeSeriesApiDataA?.mg) > 0.75
                ? "good"
                : parseFloat(timeSeriesApiDataA?.mg) > 0.5
                ? "neutral"
                : "bad"
            }
          />
        </Col>
        <Col>
          <NumberCard
            label="Magic Number"
            mainValue={timeSeriesApiDataB?.mg || "--"}
            byLine="For the latest quarter"
            isVisible
            sentiment={
              parseFloat(timeSeriesApiDataB?.mg) > 0.75
                ? "good"
                : parseFloat(timeSeriesApiDataB?.mg) > 0.5
                ? "neutral"
                : "bad"
            }
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <NumberCard
            label="Payback period (months)"
            mainValue={timeSeriesApiDataA?.pbTSlast || "--"}
            byLine="For the latest quarter"
            isVisible
            sentiment={
              parseInt(timeSeriesApiDataA?.pbTSlast) < 12 ? "good" : "bad"
            }
          />
        </Col>
        <Col>
          <NumberCard
            label="Payback period (months)"
            mainValue={timeSeriesApiDataB?.pbTSlast || "--"}
            byLine="For the latest quarter"
            isVisible
            sentiment={
              parseInt(timeSeriesApiDataB?.pbTSlast) < 12 ? "good" : "bad"
            }
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <NumberCard
            label="CAC Ratio"
            mainValue={timeSeriesApiDataA?.cac || "--"}
            byLine="For the latest quarter"
            isVisible
          />
        </Col>
        <Col>
          <NumberCard
            label="CAC Ratio"
            mainValue={timeSeriesApiDataB?.cac || "--"}
            byLine="For the latest quarter"
            isVisible
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <NumberCard
            label="LTV:CAC Ratio"
            mainValue={timeSeriesApiDataA?.ltvcac || "--"}
            byLine="For the latest quarter"
            isVisible
            sentiment={
              parseFloat(timeSeriesApiDataA?.ltvcac) > 3
                ? "good"
                : parseFloat(timeSeriesApiDataA?.ltvcac) > 1
                ? "neutral"
                : "bad"
            }
          />
        </Col>
        <Col>
          <NumberCard
            label="LTV:CAC Ratio"
            mainValue={timeSeriesApiDataB?.ltvcac || "--"}
            byLine="For the latest quarter"
            isVisible
            sentiment={
              parseFloat(timeSeriesApiDataB?.ltvcac) > 3
                ? "good"
                : parseFloat(timeSeriesApiDataB?.ltvcac) > 1
                ? "neutral"
                : "bad"
            }
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
                else sendAlertNotification("Invalid Dates");
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
      </Row>
      <Row>
        <Col>
          <b>{companyNameA.label}</b>
        </Col>
        <Col>
          <b>{companyNameB.label}</b>
        </Col>
      </Row>
      <Row>
        <Col className="col-md-6">
          <ChartCard
            type="line"
            label={timeseriesChartLabels[0].label}
            mainValue={companyApiDataA.ARR}
            chartObject={chartData(
              timeSeriesApiDataA.quarTS,
              timeSeriesApiDataA.arrTS,
              startA,
              endA
            )}
            isVisible={multipleSelect.some(
              (selection) => selection.value === timeseriesChartLabels[0].value
            )}
          />
        </Col>
        <Col className="col-md-6">
          <ChartCard
            type="line"
            label={timeseriesChartLabels[0].label}
            mainValue={companyApiDataB.ARR}
            chartObject={chartData(
              timeSeriesApiDataB.quarTSB,
              timeSeriesApiDataB.arrTS,
              startB,
              endB
            )}
            isVisible={multipleSelect.some(
              (selection) => selection.value === timeseriesChartLabels[0].value
            )}
          />
        </Col>
      </Row>
      <Row>
        <Col className="col-md-6">
          <ChartCard
            type="line"
            label={timeseriesChartLabels[1].label}
            mainValue={companyApiDataA.NRR}
            chartObject={chartData(
              timeSeriesApiDataA.quarTS,
              timeSeriesApiDataA.nrrTS,
              startA,
              endA
            )}
            isVisible={multipleSelect.some(
              (selection) => selection.value === timeseriesChartLabels[1].value
            )}
          />
        </Col>
        <Col className="col-md-6">
          <ChartCard
            type="line"
            label={timeseriesChartLabels[1].label}
            mainValue={companyApiDataB.NRR}
            chartObject={chartData(
              timeSeriesApiDataB.quarTS,
              timeSeriesApiDataB.nrrTS,
              startB,
              endB
            )}
            isVisible={multipleSelect.some(
              (selection) => selection.value === timeseriesChartLabels[1].value
            )}
          />
        </Col>
      </Row>
      <Row>
        <Col className="col-md-6">
          <ChartCard
            type="line"
            label={timeseriesChartLabels[2].label}
            mainValue={companyApiDataA.Customers}
            chartObject={chartData(
              timeSeriesApiDataA.quarTS,
              timeSeriesApiDataA.custTS,
              startA,
              endA
            )}
            isVisible={multipleSelect.some(
              (selection) => selection.value === timeseriesChartLabels[2].value
            )}
          />
        </Col>
        <Col className="col-md-6">
          <ChartCard
            type="line"
            label={timeseriesChartLabels[2].label}
            mainValue={companyApiDataB.Customers}
            chartObject={chartData(
              timeSeriesApiDataB.quarTS,
              timeSeriesApiDataB.custTS,
              startB,
              endB
            )}
            isVisible={multipleSelect.some(
              (selection) => selection.value === timeseriesChartLabels[2].value
            )}
          />
        </Col>
      </Row>
      <Row>
        <Col className="col-md-6">
          <ChartCard
            type="line"
            label={timeseriesChartLabels[3].label}
            mainValue=""
            chartObject={chartData(
              timeSeriesApiDataA.quarTS,
              timeSeriesApiDataA.pbTS,
              startA,
              endA
            )}
            isVisible={multipleSelect.some(
              (selection) => selection.value === timeseriesChartLabels[3].value
            )}
          />
        </Col>
        <Col className="col-md-6">
          <ChartCard
            type="line"
            label={timeseriesChartLabels[3].label}
            mainValue=""
            chartObject={chartData(
              timeSeriesApiDataB.quarTS,
              timeSeriesApiDataB.pbTS,
              startB,
              endB
            )}
            isVisible={multipleSelect.some(
              (selection) => selection.value === timeseriesChartLabels[3].value
            )}
          />
        </Col>
      </Row>
      <Row>
        <Col className="col-md-6">
          <ChartCard
            type="line"
            label={timeseriesChartLabels[4].label}
            mainValue=""
            chartObject={chartData(
              timeSeriesApiDataA.quarTS,
              timeSeriesApiDataA.icacTS,
              startA,
              endA
            )}
            isVisible={multipleSelect.some(
              (selection) => selection.value === timeseriesChartLabels[4].value
            )}
          />
        </Col>
        <Col className="col-md-6">
          <ChartCard
            type="line"
            label={timeseriesChartLabels[4].label}
            mainValue=""
            chartObject={chartData(
              timeSeriesApiDataB.quarTS,
              timeSeriesApiDataB.icacTS,
              startB,
              endB
            )}
            isVisible={multipleSelect.some(
              (selection) => selection.value === timeseriesChartLabels[4].value
            )}
          />
        </Col>
      </Row>
      <Row>
        <Col className="col-md-6">
          <ChartCard
            type="line"
            label={timeseriesChartLabels[5].label}
            mainValue=""
            chartObject={chartData(
              timeSeriesApiDataA.quarTS,
              timeSeriesApiDataA.ltvTS,
              startA,
              endA
            )}
            isVisible={multipleSelect.some(
              (selection) => selection.value === timeseriesChartLabels[5].value
            )}
          />
        </Col>
        <Col className="col-md-6">
          <ChartCard
            type="line"
            label={timeseriesChartLabels[5].label}
            mainValue=""
            chartObject={chartData(
              timeSeriesApiDataB.quarTS,
              timeSeriesApiDataB.ltvTS,
              startB,
              endB
            )}
            isVisible={multipleSelect.some(
              (selection) => selection.value === timeseriesChartLabels[5].value
            )}
          />
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
                        {companyNameA.label}
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
                        {tickerA}
                      </span>
                      {"  "}
                      <b>vs</b>
                      {"  "}

                      <span style={{ verticalAlign: "middle" }}>
                        {companyNameB.label}
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
                        {tickerB}
                      </span>
                    </h1>
                  </CardTitle>
                  <div>
                    <Button
                      onClick={() => {
                        window.location.reload();
                      }}
                    >
                      Compare Again
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

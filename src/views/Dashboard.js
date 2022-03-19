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
import TagsInput from "components/TagsInput/TagsInput.js";
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

  const [isOpen, setIsOpen] = useState(1);
  const [lists, setLists] = useState([]);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [naviTab, setNaviTab] = useState(1);
  const notificationAlertRef = React.useRef(null);
  const refToConvertFull = React.createRef();
  const refToConvertTab = React.createRef();
  const [companyApiData, setCompanyApiData] = useState({});
  const [overviewApiData, setOverviewApiData] = useState({});
  const [sentimentApiData, setSentimentApiData] = useState({
    finbSenti: {},
    dictSenti: {},
  });
  const [openedCollapseOne, setOpenedCollapseOne] = useState(false);
  const [ticker, setTicker] = useState("");
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(100);
  const [fromFillingDate, setFromFillingDate] = useState("");
  const [toFillingDate, setToFillingDate] = useState("");
  const [multipleSelect, setMultipleSelect] = useState(timeseriesChartLabels);
  const [tagsinput, setTagsinput] = useState(["twitter", "trends"]);
  const [sentimentElement, setSentimentElement] = useState(<></>);
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
    setTagsinput(twitdata.trendingWords);
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
    async function setValues() {
      setOverviewData();
      setTimeSeriesData();
      setSentimentData();
      settwitterdata();
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

  const handleTagsinput = (tagsinput) => {
    setTagsinput(tagsinput);
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

  const refToConvertSummary = React.createRef();

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
          <NumberCard
            label="Magic Number"
            mainValue={
              Math.round(parseFloat(timeSeriesApiData?.mg) * 100000) / 100
            }
            byLine="For the latest quarter"
            isVisible
          />
        </Col>
        <Col>
          <NumberCard
            label="Payback period (months)"
            mainValue={parseFloat(parseInt(timeSeriesApiData?.pbTSlast)) / 100}
            byLine="For the latest quarter"
            isVisible
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <NumberCard
            label="CAC Ratio"
            mainValue={
              Math.round(parseFloat(timeSeriesApiData?.cac) * 100000) / 100
            }
            byLine="For the latest quarter"
            isVisible
          />
        </Col>
        <Col>
          <NumberCard
            label="LTV:CAC Ratio"
            mainValue={
              Math.round(parseFloat(timeSeriesApiData?.ltvcac) * 100000) / 100
            }
            byLine="For the latest quarter"
            isVisible
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
                      <h5>Probabality</h5>
                    </Col>
                    <Col>
                      <h5>Sentiment</h5>
                    </Col>
                    <Col>
                      <h5>Probabality</h5>
                    </Col>
                    <Col>
                      <h5>Sentiment</h5>
                    </Col>
                    <Col>
                      <h5>Probabality</h5>
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
                      <h5>Probabality</h5>
                    </Col>
                    <Col>
                      <h5>Sentiment</h5>
                    </Col>
                    <Col>
                      <h5>Probabality</h5>
                    </Col>
                    <Col>
                      <h5>Sentiment</h5>
                    </Col>
                    <Col>
                      <h5>Probabality</h5>
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
            {tagsinput?.map((item) => {
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
            label="EPS"
            mainValue={overviewApiData?.eps}
            byLine=""
            isVisible
          />
        </Col>
        <Col>
          <NumberCard
            label="Profit Margin"
            mainValue={overviewApiData?.profitmargin}
            byLine=""
            isVisible
          />
        </Col>
        <Col>
          <NumberCard
            label="Operating margin"
            mainValue={overviewApiData?.operatingmarginttm}
            byLine=""
            isVisible
          />
        </Col>
        <Col>
          <NumberCard
            label="P/E"
            mainValue={
              overviewApiData?.pe === "None" ? "--" : overviewApiData?.pe
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
              timeSeriesApiData.pbTS,
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
              timeSeriesApiData.icacTS,
              start,
              end
            )}
            isVisible={multipleSelect.some(
              (selection) => selection.value === timeseriesChartLabels[4].value
            )}
          />
        </Col>
        <Col>
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
            isVisible={multipleSelect.some(
              (selection) => selection.value === timeseriesChartLabels[5].value
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
                    <TabPane tabId={3}>
                      <div
                        aria-multiselectable={true}
                        className="card-collapse"
                        id="accordion"
                        role="tablist"
                      >
                        {lists.map((list) => (
                          <Card key={lists.indexOf(list)}>
                            <CardHeader
                              onClick={() => handleToggle(lists.indexOf(list))}
                            >
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
                    <TabPane tabId={4}>
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

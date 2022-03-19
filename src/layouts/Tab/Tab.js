import React, { useState } from "react";

import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Collapse,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button,
  FormGroup,
} from "reactstrap";

import ReactDatetime from "react-datetime";

import Select from "react-select";

import ChartCard from "components/Charts/ChartCard";
import Footer from "components/Footer/Footer";
import PrintBtn from "components/PrintBtn/PrintBtn";
import NumberCard from "components/NumberCards/NumberCards";
import {
  getCompanyByName,
  getOverviewByTicker,
  getTimeSeriesByTicker,
  getQnaByTicker,
} from "api/callbacks";

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

const TabLayout = () => {
  const companyName = localStorage.getItem("companyName");

  const multipleSelectValues = [
    { value: "ARR", label: "Annual Recurring Revenue (ARR)" },
    { value: "NRR", label: "Net Revenue Retention Rate (NRR)" },
    { value: "TCUS", label: "Total customers" },
    { value: "SME", label: "Sales and marketing expense" },
    { value: "TEMP", label: "Total Employee" },
  ];

  const [multipleSelect, setMultipleSelect] = useState(multipleSelectValues);

  const numberCardValuesData = [
    {
      value: "0",
      label: "Annual Recurring Revenue (ARR)",
      byLine: "For the latest quarter",
    },
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
  const [numberCardValues, setNumberCardValues] =
    React.useState(numberCardValuesData);
  const [ticker, setTicker] = useState("");
  const [timeSeriesApiData, setTimeSeriesApiData] = useState({
    quarTS: [],
    arrTS: [1, 2],
    custTS: [1, 2],
    empTS: [1, 2],
    nrrTS: [1, 2],
    smTS: [1, 2],
    srcTS: [1, 2],
  });
  const [showTimeSeries, setShowTimeSeries] = useState(false);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(100);
  const [fromFillingDate, setFromFillingDate] = useState("");
  const [toFillingDate, setToFillingDate] = useState("");
  const [openedCollapseOne, setOpenedCollapseOne] = useState(false);
  const refToConvertFull = React.createRef();
  const refToConvertTab = React.createRef();
 
  const [pageTabs, setpageTabs] = useState("1");
  const [isOpen, setIsOpen] = useState(1);
  const [lists, setLists] = useState([]);
  const [summary, setSummary] = useState("");

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

  React.useEffect(() => {
    async function setValues() {
      const companyResult = await getCompanyByName(companyName);
      setCompanyApiData(companyResult);
      setTicker(companyResult.ticker);
      const overviewResult = await getOverviewByTicker(ticker);
      setOverviewApiData(overviewResult);
      const timeSeriesData = await getTimeSeriesByTicker(ticker);
      setTimeSeriesApiData(timeSeriesData);
      const qnadata = await getQnaByTicker(companyResult.ticker);
      setLists(qnadata.qna);
      setSummary(qnadata.summary);
    }
    setValues();
  }, [companyName, ticker]);

  const handleToggle = (id) => {
    if (isOpen === id) {
      setIsOpen(null);
    } else {
      setIsOpen(id);
    };
  }

  const overviewPane = (
    <div ref={refToConvertTab}>
      <h4 className="h5 text-light text-center">
        {overviewApiData.description}
      </h4>
      <Row>
        <Col>
          <NumberCard
            label={numberCardValues[0].label}
            mainValue={companyApiData.ARR}
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
            options={multipleSelectValues}
          />
        </Col>
        <Row>
          <div></div>
        </Row>
        <Col>
          <ChartCard
            type="line"
            label={multipleSelectValues[0].label}
            mainValue={companyApiData.ARR}
            chartObject={chartData(
              timeSeriesApiData.quarTS,
              timeSeriesApiData.arrTS,
              start,
              end
            )}
            isVisible={multipleSelect.some(
              (selection) => selection.value === multipleSelectValues[0].value
            )}
          />
        </Col>
        <Col>
          <ChartCard
            type="line"
            label={multipleSelectValues[1].label}
            mainValue={companyApiData.NRR}
            chartObject={chartData(
              timeSeriesApiData.quarTS,
              timeSeriesApiData.nrrTS,
              start,
              end
            )}
            isVisible={multipleSelect.some(
              (selection) => selection.value === multipleSelectValues[1].value
            )}
          />
        </Col>
        <Col>
          <ChartCard
            type="line"
            label={multipleSelectValues[2].label}
            mainValue={companyApiData.Customers}
            chartObject={chartData(
              timeSeriesApiData.quarTS,
              timeSeriesApiData.custTS,
              start,
              end
            )}
            isVisible={multipleSelect.some(
              (selection) => selection.value === multipleSelectValues[2].value
            )}
          />
        </Col>
        <Col>
          <ChartCard
            type="line"
            label={multipleSelectValues[3].label}
            mainValue=""
            chartObject={chartData(
              timeSeriesApiData.quarTS,
              timeSeriesApiData.smTS,
              start,
              end
            )}
            isVisible={multipleSelect.some(
              (selection) => selection.value === multipleSelectValues[3].value
            )}
          />
        </Col>
        <Col>
          <ChartCard
            type="line"
            label={multipleSelectValues[4].label}
            mainValue=""
            chartObject={chartData(
              timeSeriesApiData.quarTS,
              timeSeriesApiData.empTS,
              start,
              end
            )}
            isVisible={multipleSelect.some(
              (selection) => selection.value === multipleSelectValues[4].value
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
                  <Nav
                    className="nav-pills-info nav-pills-icons justify-content-center"
                    pills
                  >
                    <NavItem>
                      <NavLink
                        data-toggle="tab"
                        className={showTimeSeries ? "" : "active"}
                        onClick={() => setShowTimeSeries(false)}
                      >
                        <i className="tim-icons icon-zoom-split" />
                        Overview
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        data-toggle="tab"
                        className={showTimeSeries ? "active" : ""}
                        onClick={() => setShowTimeSeries(true)}
                      >
                        <i className="tim-icons icon-paper" />
                        Filling Data
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent
                    className="tab-space tab-subcategories"
                    activeTab={showTimeSeries ? "metrics" : "overview"}
                  >
                    <TabPane tabId="overview">{overviewPane}</TabPane>
                    <TabPane tabId="metrics">{metricsPane}</TabPane>
                    <TabPane tabId="qna">
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
                  </TabContent>
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
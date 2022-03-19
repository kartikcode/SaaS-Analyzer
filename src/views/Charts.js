import React, { useEffect, useState, useRef } from "react";
// react plugin used to create charts
import { Line, Bar, Pie } from "react-chartjs-2";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  FormGroup,
  Button,
} from "reactstrap";

// core components
import {
  chartExample5,
  chartExample6,
  chartExample7,
  chartExample8,
  chartExample9,
  chartExample10,
} from "variables/charts.js";
import LoadingOverlay from "react-loading-overlay";
import NotificationAlert from "react-notification-alert";
import { searchOptions } from "variables/companies";
import Select from "react-select";
import ReactDatetime from "react-datetime";

const Charts = () => {
  const notificationAlertRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [multipleSelect, setMultipleSelect] = useState([]);
  const [fromFillingDate, setFromFillingDate] = useState("");
  const [toFillingDate, setToFillingDate] = useState("");

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

  const handleSearch = async (from, to) => {
    setIsLoading(true);
  };
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
          <div className="">
            <Card>
              <CardBody>
                <Row>
                  <Col md="4">
                    <h4 className="h4 text-white">Select what to display:</h4>
                  </Col>
                  <Col lg="8" md="8" sm="3">
                    <Select
                      className="react-select info"
                      classNamePrefix="react-select"
                      placeholder="Choose companies..."
                      name="multipleSelect"
                      closeMenuOnSelect={false}
                      isMulti
                      value={multipleSelect}
                      onChange={(value) => {
                        if (value == null) setMultipleSelect([]);
                        else setMultipleSelect(value);
                      }}
                      options={searchOptions}
                    />
                  </Col>
                </Row>
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
                            handleSearch(fromFillingDate, toFillingDate);
                          else sendAlertNotification("Invalid dates");
                        }}
                      >
                        Filter by Filling Date
                      </Button>
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </div>
        </div>
      </LoadingOverlay>
    </>
  );
};

export default Charts;

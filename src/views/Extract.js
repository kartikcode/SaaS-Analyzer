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
  CardBody,
  Label,
  FormGroup,
} from "reactstrap";
import NotificationAlert from "react-notification-alert";
import Select from "react-select";
import ReactDatetime from "react-datetime";
import {
  searchOptions,
} from "variables/companies";


const customStyles = {
  input: (provided) => ({
    ...provided,
    color: "#1d8cf8",
  }),
};

const Extract = () => {
  const [companyName, setCompanyName] = React.useState({
    value: "",
    label: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const notificationAlertRef = React.useRef(null);
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

  const handleOnClickSearch = async () => {
    setIsLoading(true);
    if (companyName.value.length === 0) {
      sendAlertNotification("Please select a company");
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
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
            Download CSV
          </Button>
        </div>
      </CardBody>
    </Card>
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
          <div className="">{searchForm}</div>
        </div>
      </LoadingOverlay>
    </>
  );
};

export default Extract;

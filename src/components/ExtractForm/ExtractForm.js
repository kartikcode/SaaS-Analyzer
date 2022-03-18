import React from "react";

import { FormGroup, Label, Button } from "reactstrap";
import NotificationAlert from "react-notification-alert";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import { searchOptions } from "variables/companies";

const customStyles = {
  input: (provided) => ({
    ...provided,
    color: "#1d8cf8",
  }),
};

const typeOptions = [
  { value: "10K", label: "10K" },
  { value: "10Q", label: "10Q" },
  { value: "8K", label: "8K" },
];

const yearOptions = [
  { value: 2022, label: "2022" },
  { value: 2021, label: "2021" },
  { value: 2020, label: "2020" },
  { value: 2019, label: "2019" },
];

const ExtractForm = () => {
  const [searchCompany, setSearchCompany] = React.useState({
    value: "",
    label: "",
  });
  const [formType, setFormType] = React.useState({
    value: "",
    label: "",
  });
  const [year, setYear] = React.useState({ value: 2022, label: "2022" });
  const notificationAlertRef = React.useRef(null);

  const history = useHistory();

  const onSubmitButtonClick = (e) => {
    e.preventDefault();

    if (searchCompany.value.length === 0) {
      let options = {};
      options = {
        place: "tr",
        message: "Please enter a company name",
        type: "danger",
        icon: "tim-icons icon-bell-55",
        autoDismiss: 7,
      };
      notificationAlertRef.current.notificationAlert(options);
      return;
    }

    console.log(searchCompany.value, formType.value, year.value);
    localStorage.setItem("ExtractionSearchCompany", searchCompany.value);
    history.push("/extract");
  };
  return (
    <>
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <form onSubmit={(e) => onSubmitButtonClick(e)}>
        <FormGroup>
          <Label for="Company Name">Company Name</Label>
          <Select
            styles={customStyles}
            className="react-select info"
            classNamePrefix="react-select"
            value={searchCompany}
            onChange={(value) => setSearchCompany(value)}
            options={searchOptions}
          />
        </FormGroup>
        <div className="form-row">
          <FormGroup className="col-md-6">
            <Label for="Year">Year</Label>
            <Select
              styles={customStyles}
              className="react-select info"
              classNamePrefix="react-select"
              value={year}
              onChange={(value) => setYear(value)}
              options={yearOptions}
            />
          </FormGroup>
          <FormGroup className="col-md-6">
            <Label for="Form Type">Form Type</Label>
            <Select
              styles={customStyles}
              className="react-select info"
              classNamePrefix="react-select"
              value={formType}
              onChange={(value) => setFormType(value)}
              options={typeOptions}
            />
          </FormGroup>
        </div>
        <Button type="submit" color="primary">
          Extract Data
        </Button>
        <Button type="submit" color="warning">
          Download Complete Form
        </Button>
      </form>
    </>
  );
};

export default ExtractForm;

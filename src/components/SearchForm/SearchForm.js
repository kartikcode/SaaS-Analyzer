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

const yearOptions = [
  { value: 2022, label: "2022" },
  { value: 2021, label: "2021" },
  { value: 2020, label: "2020" },
  { value: 2019, label: "2019" },
];

const quarterOptions = [
  { value: "Q1", label: "Q1" },
  { value: "Q2", label: "Q2" },
  { value: "Q3", label: "Q3" },
  { value: "Q4", label: "Q4" },
];

const SearchForm = () => {
  const [search, setSearch] = React.useState({ value: "", label: "" });
  const [fromYear, setFromYear] = React.useState(yearOptions[1]);
  const [toYear, setToYear] = React.useState(yearOptions[0]);
  const [fromQuater, setFromQuater] = React.useState(quarterOptions[0]);
  const [toQuater, setToQuater] = React.useState(quarterOptions[0]);
  const notificationAlertRef = React.useRef(null);

  const history = useHistory();

  const onSubmitButtonClick = (e) => {
    e.preventDefault();
    if (
      fromYear.value > toYear.value ||
      (fromYear.value === toYear.value &&
        parseInt(toQuater.value[1]) < parseInt(fromQuater.value[1]))
    ) {
      let options = {};
      options = {
        place: "tr",
        message: "Invalid Year selection",
        type: "danger",
        icon: "tim-icons icon-bell-55",
        autoDismiss: 7,
      };
      notificationAlertRef.current.notificationAlert(options);
      return;
    }
    if (search.value.length === 0) {
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
    console.log(
      search.value,
      fromYear.value,
      toYear.value,
      fromQuater.value,
      toQuater.value
    );
    // redirect to /tab
    history.push("/tab");
  };
  return (
    <>
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <form onSubmit={(e) => onSubmitButtonClick(e)}>
        <FormGroup>
          <Label for="search">Search</Label>
          <Select
            styles={customStyles}
            className="react-select info"
            classNamePrefix="react-select"
            value={search}
            onChange={(value) => setSearch(value)}
            options={searchOptions}
          />
        </FormGroup>
        <div className="form-row">
          <FormGroup className="col-md-4">
            <Label for="fromYear">From Year</Label>
            <Select
              styles={customStyles}
              className="react-select info"
              classNamePrefix="react-select"
              value={fromYear}
              onChange={(value) => setFromYear(value)}
              options={yearOptions}
            />
          </FormGroup>
          <FormGroup className="col-md-2">
            <Label for="fromQuater">From Quater</Label>
            <Select
              styles={customStyles}
              className="react-select info"
              classNamePrefix="react-select"
              value={fromQuater}
              onChange={(value) => setFromQuater(value)}
              options={quarterOptions}
            />
          </FormGroup>
          <FormGroup className="col-md-4">
            <Label for="toYear">To Year</Label>
            <Select
              styles={customStyles}
              className="react-select info"
              classNamePrefix="react-select"
              value={toYear}
              onChange={(value) => setToYear(value)}
              options={yearOptions}
            />
          </FormGroup>
          <FormGroup className="col-md-2">
            <Label for="toQuater">To Quater</Label>
            <Select
              styles={customStyles}
              className="react-select info"
              classNamePrefix="react-select"
              value={toQuater}
              onChange={(value) => setToQuater(value)}
              options={quarterOptions}
            />
          </FormGroup>
        </div>
        <Button type="submit" color="primary">
          Search
        </Button>
      </form>
    </>
  );
};

export default SearchForm;

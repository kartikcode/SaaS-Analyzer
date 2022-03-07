import React from "react";

import { FormGroup, Label, Input, Button } from "reactstrap";
import NotificationAlert from "react-notification-alert";

const SearchForm = () => {
  const [search, setSearch] = React.useState("");
  const searchForm = React.useRef(null);

  const [fromYear, setFromYear] = React.useState(2021);
  const [toYear, setToYear] = React.useState(2021);
  const [fromQuater, setFromQuater] = React.useState("Q1");
  const [toQuater, setToQuater] = React.useState("Q1");

  const notificationAlertRef = React.useRef(null);

  const onSubmitButtonClick = (e) => {
    e.preventDefault();
    if (
      fromYear > toYear ||
      (fromYear === toYear && parseInt(toQuater[1]) < parseInt(fromQuater[1]))
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
    console.log(search);
    console.log(fromYear);
    console.log(toYear);
    console.log(fromQuater);
    console.log(toQuater);
  };
  return (
    <>
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <form onSubmit={(e) => onSubmitButtonClick(e)}>
        <FormGroup>
          <Label for="companyName">Company Name</Label>
          <Input
            type="text"
            id="companyName"
            placeholder="Company Name"
            value={search}
            ref={searchForm}
            onChange={(e) => setSearch(e.target.value)}
          />
        </FormGroup>
        <div className="form-row">
          <FormGroup className="col-md-4">
            <Label for="fromYear">From Year</Label>
            <Input
              type="select"
              name="fromYear"
              id="fromYear"
              value={fromYear}
              onChange={(e) => setFromYear(e.target.value)}
            >
              <option>2021</option>
              <option>2020</option>
              <option>2019</option>
              <option>2018</option>
              <option>2017</option>
              <option>2016</option>
            </Input>
          </FormGroup>
          <FormGroup className="col-md-2">
            <Label for="fromQuater">From Quater</Label>
            <Input
              type="select"
              name="fromQuater"
              id="fromQuater"
              value={fromQuater}
              onChange={(e) => setFromQuater(e.target.value)}
            >
              <option>Q1</option>
              <option>Q2</option>
              <option>Q3</option>
              <option>Q4</option>
            </Input>
          </FormGroup>
          <FormGroup className="col-md-4">
            <Label for="toYear">To Year</Label>
            <Input
              type="select"
              name="toYear"
              id="toYear"
              value={toYear}
              onChange={(e) => setToYear(e.target.value)}
            >
              <option>2021</option>
              <option>2020</option>
              <option>2019</option>
              <option>2018</option>
              <option>2017</option>
              <option>2016</option>
            </Input>
          </FormGroup>
          <FormGroup className="col-md-2">
            <Label for="toQuater">To Quater</Label>
            <Input
              type="select"
              name="toQuater"
              id="toQuater"
              value={toQuater}
              onChange={(e) => setToQuater(e.target.value)}
            >
              <option>Q1</option>
              <option>Q2</option>
              <option>Q3</option>
              <option>Q4</option>
            </Input>
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

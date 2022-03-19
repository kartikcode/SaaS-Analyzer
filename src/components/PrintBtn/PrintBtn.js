import React from "react";
import { Button } from "reactstrap";
import ReactToPrint from "react-to-print";

const PrintBtn = ({ refToConvert }) => {
  return (
    <ReactToPrint
      trigger={() => (
        <Button className="btn-md float-right">
          <i className="tim-icons icon-paper"></i>{"  "}Print
        </Button>
      )}
      content={() => refToConvert.current}
      copyStyles
    />
  );
};

export default PrintBtn;
